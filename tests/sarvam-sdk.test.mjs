import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Exercise the installed SDK implementation, replacing only imports and browser
// transport/timers with controlled fixtures. No microphone or network is used.
const source = (await readFile(new URL('../node_modules/sarvam-conv-ai-sdk/dist/modules/socket-manager.js', import.meta.url),'utf8')).replace(/^import .*;\n/gm,'');
const fixture = `
const AgentState={IDLE:'idle',CONNECTING:'connecting',CONNECTED:'connected',LISTENING:'listening',ERROR:'error'};
const RateLimitError=Error,AuthenticationError=Error,ForbiddenError=Error,NotFoundError=Error,ServerError=Error;
const ClientMsgType={},MsgOrigin={},ServerMsgType={};
const createStartInteractionMessageFromConfig=()=>({});
const parseServerMessage=x=>x;
export const activeIntervals=new Set();let sequence=0;
const setInterval=()=>{const id=++sequence;activeIntervals.add(id);return id};
const clearInterval=id=>activeIntervals.delete(id);
export class FixtureSocket {
 static last;
 constructor(){this.readyState=0;this.handlers={};FixtureSocket.last=this;}
 addEventListener(name,fn){this.handlers[name]=fn;}
 send(){}
 close(){if(this.readyState===3)return;this.readyState=3;this.handlers.close?.({code:1000,reason:'',wasClean:true});}
 async open(){this.readyState=1;await this.handlers.open();}
}
const getWebSocket=()=>FixtureSocket;
const window={WebSocket:FixtureSocket,addEventListener(){},removeEventListener(){}};
`;
const {SocketManager,FixtureSocket,activeIntervals}=await import('data:text/javascript;base64,'+Buffer.from(fixture+source).toString('base64'));
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function create() {
  const agent=new SocketManager({apiKey:'',config:{}});
  agent.getSignedUrl=async()=>({signedUrl:'wss://example.test',referenceId:'fixture'});
  agent.augmentWsUrlWithParams=value=>value;
  agent.onWebSocketOpen=async()=>{};
  agent.flushSendQueue=()=>{};
  agent.stops=0;
  agent.onStop=async()=>{agent.stops++;};
  return agent;
}

test('SDK connecting socket is not ready and the connection timeout is effective',async()=>{
  const agent=create();
  await agent.start();
  try {
    assert.equal(agent.isConnected(),false);
    assert.equal(await agent.waitForConnect(0.01),false);
  } finally {await agent.stop();}
});

test('SDK waits for microphone initialization even if interaction acknowledgement arrives first',async()=>{
  const agent=create();let release;
  agent.onWebSocketOpen=()=>new Promise(resolve=>{release=resolve;});
  await agent.start();
  const opening=FixtureSocket.last.open();await tick();
  await agent.handleInteractionStartAcknowledgement({interaction_id:'interaction'});
  try {
    assert.equal(agent.isConnected(),false);
    assert.equal(agent.getState(),'connecting');
  } finally {release();await opening;}
  try {
    assert.equal(await agent.waitForConnect(0.05),true);
    assert.equal(agent.getState(),'listening');
  } finally {await agent.stop();}
  assert.equal(activeIntervals.size,0);
});

test('SDK waits for interaction acknowledgement after microphone initialization',async()=>{
  const agent=create();await agent.start();await FixtureSocket.last.open();
  try {
    assert.equal(agent.isConnected(),false);
    const ready=agent.waitForConnect(0.05);
    await agent.handleInteractionStartAcknowledgement({interaction_id:'interaction'});
    assert.equal(await ready,true);
  } finally {await agent.stop();}
  assert.equal(agent.isConnected(),false);
  assert.equal(activeIntervals.size,0);
});

test('SDK cleans up once on network close and reentrant end callbacks',async()=>{
  const agent=create();let ends=0;
  agent.endCallback=async()=>{ends++;await agent.stop();};
  await agent.start();await FixtureSocket.last.open();FixtureSocket.last.close();await tick();
  await agent.waitForDisconnect();
  assert.equal(agent.stops,1);assert.equal(ends,1);assert.equal(activeIntervals.size,0);
});

test('SDK handles a rejected socket loop without an unhandled rejection',async()=>{
  const agent=create();const states=[];agent.stateCallback=state=>states.push(state);
  agent.runWebSocketLoop=async()=>{throw new Error('fixture failure');};
  await agent.start();await tick();
  assert.equal(agent.stops,1);assert.equal(agent.shouldStop,true);assert.ok(states.includes('error'));
});

test('SDK cancellation while microphone permission is pending never becomes ready',async()=>{
  const agent=create();let release;agent.onWebSocketOpen=()=>new Promise(resolve=>{release=resolve;});
  await agent.start();const opening=FixtureSocket.last.open();await tick();
  await agent.handleInteractionStartAcknowledgement({interaction_id:'interaction'});
  await agent.stop();release();await opening;
  assert.equal(agent.isConnected(),false);assert.equal(activeIntervals.size,0);
  assert.equal(agent.stops,2); // Stop immediately, then clean resources obtained after permission resolves.
});
