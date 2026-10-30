const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('../Logistik/api/admin-users.js','utf8');
let identity, updates, audit, calls;
const chain = { select(){return this},eq(){return this},order(){return this},range(){return Promise.resolve({data:[],error:null})},update(value){updates.push(value);return this},single(){return Promise.resolve({data:{id:'target',email:'test@test.dk'},error:null})},insert(value){audit.push(value);return Promise.resolve({error:null})},then(resolve){resolve({data:[],error:null})} };
const service = {from(){calls++;return chain}};
const sandbox = {module:{exports:{}},require:()=>({getServiceClient:()=>service,requireUser:async()=>identity})};
vm.runInNewContext(code,sandbox);
async function run(method,body,query,origin){updates=[];audit=[];calls=0;const result={headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.data=data},end(){}};await sandbox.module.exports({method,body,query,headers:origin?{origin}:{}},result);return result}
(async()=>{
 identity={error:'Nej',status:401}; assert.equal((await run('GET',null,{list:'all'})).code,401);
 identity={profile:{is_admin:false},user:{id:'self'}}; assert.equal((await run('POST',{action:'force_logout',user_id:'target'})).code,403);assert.equal(updates.length,0);
 identity={profile:{is_admin:true},user:{id:'self',email:'admin@test.dk'}};
 for(const action of ['force_logout','suspend','reject']) {assert.equal((await run('POST',{action,user_id:'self'})).code,400);assert.equal(updates.length,0)}
 assert.equal((await run('POST',{action:'set_admin',user_id:'self',is_admin:false})).code,400);
 assert.equal((await run('POST',{action:'force_logout',user_id:'target'})).code,200);assert.ok(updates[0].force_logout_at);assert.equal(audit[0].action,'force_logout');
 assert.equal((await run('GET',null,{list:'all'})).code,200);
 assert.equal((await run('GET')).code,200);
 for(const origin of ['https://projekt-phi-six.vercel.app','https://projekt-git-platform-gytismadsen-blips-projects.vercel.app','http://127.0.0.1:8765']) {const r=await run('OPTIONS',null,null,origin);assert.equal(r.code,204);assert.equal(r.headers['Access-Control-Allow-Origin'],origin)}
 const evil=await run('OPTIONS',null,null,'https://evil.test');assert.equal(evil.code,403);assert.equal(evil.headers['Access-Control-Allow-Origin'],undefined);
 console.log('API: 14 adgangs-, CORS- og kompatibilitetskontroller bestået');
})().catch(e=>{console.error(e);process.exitCode=1});
