import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { saveDiscoveryRow, saveContactRow, googleDiscoveryReady, columnName } from "../lib/server/google-discovery.ts";
import { CONTACT_HEADERS } from "../lib/contact-sheet.ts";
import { DISCOVERY_HEADERS } from "../lib/discovery-sheet.ts";
const id="3136a165-c099-4083-89eb-a45cd192477d",hash="a".repeat(64);
const row=()=>[id,hash,...Array(DISCOVERY_HEADERS.length-2).fill("private@example.com")];
async function fixture(t,mode="success") {
  const directory=await mkdtemp(join(tmpdir(),"discovery-adapter-test-"));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const rows=[],requests=[];
  const client={request:async options=>{
    requests.push(options);
    if(options.url.includes("?fields=sheets")) return {data:{sheets:[{properties:{title:"Assessments",gridProperties:{rowCount:1000}}},{properties:{title:"Contact Queries",gridProperties:{rowCount:1000}}}]}};
    if(options.method==="POST") {
      if(mode!=="timeout-before")rows.push(options.data.values[0].slice(0,2));
      if(mode.startsWith("timeout"))throw Error("ambiguous timeout");
      return {data:{updates:{updatedRows:1}}};
    }
    return {data:{values:rows}};
  }};
  return {directory,requests,rows,options:{directory,connect:async()=>({client,base:"https://sheets.googleapis.com/v4/spreadsheets/test/values/"})}};
}
test("RAW append matches schema; retries deduplicate and receipts contain no PII",async t=>{
  const f=await fixture(t);
  assert.deepEqual(await saveDiscoveryRow(id,hash,row(),f.options),{receiptId:id});
  assert.deepEqual(await saveDiscoveryRow(id,hash,row(),f.options),{receiptId:id});
  const writes=f.requests.filter(r=>r.method==="POST");
  assert.equal(writes.length,1);assert.match(writes[0].url,/valueInputOption=RAW/);
  assert.equal(writes[0].data.values[0].length,DISCOVERY_HEADERS.length);
  const receipt=await readFile(join(f.directory,id+".json"),"utf8");
  assert.deepEqual(JSON.parse(receipt),{fingerprint:hash,status:"confirmed"});
  assert.equal(receipt.includes("private@example.com"),false);
  assert.deepEqual(await readdir(f.directory),[id+".json"]);
  const changed=row();changed[1]="b".repeat(64);
  await assert.rejects(saveDiscoveryRow(id,changed[1],changed,f.options),/already used/);
  assert.deepEqual(await readdir(f.directory),[id+".json"]);
  await assert.rejects(saveDiscoveryRow(id,hash,row().slice(1),f.options),/Invalid assessment row/);
});

test("contacts use a separate tab with RAW writes and safe deduplication",async t=>{
  const f=await fixture(t);
  const contact=[id,hash,...Array(CONTACT_HEADERS.length-2).fill("contact@example.com")];
  await saveContactRow(id,hash,contact,f.options);await saveContactRow(id,hash,contact,f.options);
  const writes=f.requests.filter(r=>r.method==="POST");assert.equal(writes.length,1);
  assert.equal(decodeURIComponent(writes[0].url).includes("'Contact Queries'!A1"),true);
  assert.match(writes[0].url,/valueInputOption=RAW/);assert.equal(writes[0].data.values[0].length,CONTACT_HEADERS.length);
  const changed=[...contact];changed[1]="b".repeat(64);
  await assert.rejects(saveContactRow(id,changed[1],changed,f.options),/already used/);
});
test("ambiguous write reconciles against the sheet without another append",async t=>{
  const f=await fixture(t,"timeout-after");
  await assert.rejects(saveDiscoveryRow(id,hash,row(),f.options),/timeout/);
  assert.deepEqual(await readdir(f.directory),[id+".json"]);
  assert.equal(JSON.parse(await readFile(join(f.directory,id+".json"))).status,"pending");
  assert.deepEqual(await saveDiscoveryRow(id,hash,row(),f.options),{receiptId:id});
  assert.equal(f.requests.filter(r=>r.method==="POST").length,1);
});
test("ambiguous write with no remote row never blindly retries",async t=>{
  const f=await fixture(t,"timeout-before");
  await assert.rejects(saveDiscoveryRow(id,hash,row(),f.options),/timeout/);
  await assert.rejects(saveDiscoveryRow(id,hash,row(),f.options),/unconfirmed/);
  assert.equal(f.requests.filter(r=>r.method==="POST").length,1);
  assert.deepEqual(await readdir(f.directory),[id+".json"]);
});
test("conflicting or duplicate remote identifiers reject and release lock",async t=>{
  const f=await fixture(t);f.rows.push([id,"b".repeat(64)]);
  await assert.rejects(saveDiscoveryRow(id,hash,row(),f.options),/conflict/);
  f.rows[0][1]=hash;f.rows.push([id,hash]);
  await assert.rejects(saveDiscoveryRow(id,hash,row(),f.options),/conflict/);
  assert.deepEqual(await readdir(f.directory),[]);
});
test("readiness fails closed on missing configuration; column bounds",async t=>{
  const directory=await mkdtemp(join(tmpdir(),"discovery-ready-test-"));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const old=process.env.DISCOVERY_GOOGLE_CONFIG_FILE;
  process.env.DISCOVERY_GOOGLE_CONFIG_FILE=join(directory,"missing.json");
  try{assert.equal(await googleDiscoveryReady(),false);}finally{if(old===undefined)delete process.env.DISCOVERY_GOOGLE_CONFIG_FILE;else process.env.DISCOVERY_GOOGLE_CONFIG_FILE=old;}
  assert.equal(columnName(26),"Z");assert.equal(columnName(27),"AA");
});
