import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp,rm,readdir,readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createDiscoveryReportHandlers } from "../lib/server/discovery-report-delivery.ts";
import { emptyProfile,INDUSTRIES,ORGANIZATION_SIZES } from "../lib/discovery-profile.ts";
import { dimensions } from "../lib/discovery.ts";
const payload=()=>({requestId:randomUUID(),profile:{...emptyProfile,fullName:"Report Owner",businessEmail:"owner@example.com",organization:"Example",industry:INDUSTRIES[0],organizationSize:ORGANIZATION_SIZES[0],jobTitle:"Director",dataConsent:true},answers:Object.fromEntries(dimensions.flatMap(d=>d.questions.map((_,i)=>[`${d.name}-${i}`,3])))});
const request=(data=payload(),headers={})=>new Request("http://localhost:3100/api/discovery/pdf",{method:"POST",headers:{host:"localhost:3100",origin:"http://localhost:3100","sec-fetch-site":"same-origin","x-saavantus-discovery":"1","content-type":"application/json",...headers},body:typeof data==="string"?data:JSON.stringify(data)});
async function fixture(t,overrides={}){
  const directory=await mkdtemp(join(process.env.SAAVANTUS_TEST_TEMP_DIR??tmpdir(),"report-delivery-test-"));t.after(()=>rm(directory,{recursive:true,force:true}));
  let time=100000;const sent=[],generated=[],verified=[];
  const deps={directory,now:()=>time,verify:async(request,email)=>{verified.push(email);return true;},generate:async(profile,answers)=>{generated.push({profile,answers});return new TextEncoder().encode("%PDF-fixture");},send:async(...args)=>{sent.push(args);},...overrides};
  return {directory,sent,generated,verified,handlers:createDiscoveryReportHandlers(deps),advance:ms=>time+=ms};
}
test("PDF recomputes from validated inputs and requires the exact verified profile address",async t=>{
  const f=await fixture(t);const data=payload(),response=await f.handlers.PDF(request(data));
  assert.equal(response.status,200);assert.equal(response.headers.get("content-type"),"application/pdf");assert.match(response.headers.get("content-disposition"),/attachment/);assert.equal(response.headers.get("cache-control"),"no-store");assert.equal(await response.text(),"%PDF-fixture");assert.equal(f.verified[0],data.profile.businessEmail);assert.deepEqual(f.generated[0].answers,data.answers);assert.equal(f.sent.length,0);
  const denied=await fixture(t,{verify:async()=>false});assert.equal((await denied.handlers.PDF(request())).status,403);assert.equal(denied.generated.length,0);
});
test("report boundaries reject untrusted headers, oversized JSON, forged scores and recipient fields",async t=>{
  const f=await fixture(t);
  assert.equal((await f.handlers.EMAIL(request(payload(),{origin:"https://evil.test"}))).status,403);
  assert.equal((await f.handlers.PDF(request(" ".repeat(32769)))).status,413);
  assert.equal((await f.handlers.EMAIL(request({...payload(),to:"other@example.com"}))).status,400);
  assert.equal((await f.handlers.PDF(request({...payload(),score:100}))).status,400);
  assert.equal((await f.handlers.PDF(request("{"))).status,400);assert.equal(f.sent.length,0);assert.equal(f.generated.length,0);
});
test("email sends only to verified address and deduplicates identical content with a new UUID",async t=>{
  const f=await fixture(t);const data=payload();
  const first=await f.handlers.EMAIL(request(data));assert.equal(first.status,200);const saved=await first.json();assert.equal(saved.sent,true);
  const retry=await f.handlers.EMAIL(request({...data,requestId:randomUUID()}));assert.equal((await retry.json()).duplicate,true);assert.equal(f.sent.length,1);assert.equal(f.sent[0][0],data.profile.businessEmail);assert.equal(new TextDecoder().decode(f.sent[0][3]),"%PDF-fixture");
  for(const filename of await readdir(f.directory)){const text=await readFile(join(f.directory,filename),"utf8");assert.equal(text.includes("owner@example.com"),false);assert.equal(text.includes("Report Owner"),false);}
});
test("ambiguous mail failures remain pending and never automatically resend",async t=>{
  let attempts=0;const f=await fixture(t,{send:async()=>{attempts++;throw Error("private provider detail");}}),data=payload();
  const first=await f.handlers.EMAIL(request(data));assert.equal(first.status,503);assert.equal((await first.text()).includes("private provider"),false);
  assert.equal((await f.handlers.EMAIL(request({...data,requestId:randomUUID()}))).status,409);assert.equal(attempts,1);assert.equal((await readdir(f.directory)).includes("writer.lock"),false);
});
test("email quota persists and concurrent submissions cannot send duplicate content",async t=>{
  const f=await fixture(t),data=payload();
  const results=await Promise.all([f.handlers.EMAIL(request(data)),f.handlers.EMAIL(request(data))]);assert.equal(f.sent.length,1);assert.equal(results.some(r=>r.status===200),true);
  for(let i=0;i<2;i++){data.answers["Strategy-0"]=i+1;assert.equal((await f.handlers.EMAIL(request(data))).status,200);}
  data.answers["Strategy-0"]=4;assert.equal((await f.handlers.EMAIL(request(data))).status,429);
  f.advance(3600001);assert.equal((await f.handlers.EMAIL(request(data))).status,200);
});
