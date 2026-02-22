const express = require('express');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3000;

// ================= WEB =================
app.get('/', (req,res)=>{
res.send(`<body style="background:#04060f;color:#00ffd5;font-family:monospace;text-align:center;padding:50px;">
<h2>🧠 KIRA V18 ACTIVE</h2>
<p>Adaptive + Loss Defense Online</p>
</body>`);
});
app.listen(PORT);

// ================= CONFIG =================
const BOT_TOKEN = "8561861801:AAGgBWdKjmcfTR8bqUuZXWdmQ429KWeJ52U";
const TARGET_CHATS = ["1669843747", "-1002613316641"]; 

const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";
const FUND_LEVELS = [33,66,100,133,168,500,1100,2400,5000];
const STATE_FILE = './kira_state.json';

// ================= STATE =================
let state = {
lastProcessedIssue:null,
activePrediction:null,
wins:0,
totalSignals:0,
currentLevel:0,
memory:{
last50:[],
sizeWins:0,
colorWins:0,
trendWins:0,
reversalWins:0,
lossPatterns:[]
}
};

if(fs.existsSync(STATE_FILE))
state = JSON.parse(fs.readFileSync(STATE_FILE));

function saveState(){
fs.writeFileSync(STATE_FILE, JSON.stringify(state,null,2));
}

// ================= TELEGRAM =================
async function sendTelegram(text){
for(let id of TARGET_CHATS){
await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({chat_id:id,text,parse_mode:'HTML'})
});
}
}

// ================= HELPERS =================
const getSize=n=>n<=4?"SMALL":"BIG";
const getColor=n=>[0,2,4,6,8].includes(n)?"RED":"GREEN";

// ================= V18 ENGINE =================
function analyzeV18(arr,type,memory){

if(arr.length<25)
return {action:"WAIT"};

const A = type==="SIZE"?"BIG":"RED";
const B = type==="SIZE"?"SMALL":"GREEN";

const recent = arr.slice(0,8);
const mid = arr.slice(8,16);
const old = arr.slice(16,25);

const count=(l,v)=>l.filter(x=>x===v).length;

let rA=count(recent,A), rB=count(recent,B);
let mA=count(mid,A), mB=count(mid,B);
let oA=count(old,A), oB=count(old,B);

let shortBias = rA-rB;
let longBias = (mA+oA)-(mB+oB);
let pressureA = rA-mA;
let pressureB = rB-mB;

let prediction=null;
let strength=0;
let mode="";

if(shortBias>=3 && longBias>=2){
prediction=A;
mode="Momentum";
strength+=3;
}
else if(shortBias<=-3 && longBias<=-2){
prediction=B;
mode="Momentum";
strength+=3;
}
else if(pressureA<=-3){
prediction=B;
mode="Reversal";
strength+=2;
}
else if(pressureB<=-3){
prediction=A;
mode="Reversal";
strength+=2;
}

if(!prediction) return {action:"WAIT"};

// ===== MEMORY BOOST =====
if(type==="SIZE" && memory.sizeWins > memory.colorWins) strength++;
if(type==="COLOR" && memory.colorWins > memory.sizeWins) strength++;

if(mode==="Momentum" && memory.trendWins > memory.reversalWins) strength++;
if(mode==="Reversal" && memory.reversalWins > memory.trendWins) strength++;

// ===== LOSS DEFENSE =====
let lastLoss = memory.lossPatterns.slice(-3);

for(let p of lastLoss){
if(p.type===type && p.mode===mode){
return {action:"WAIT"}; // Avoid repeating losing structure
}
}

let confidence = Math.min(99,80+strength*5);

return {
type,
action:prediction,
conf:confidence,
mode
};
}

// ================= SIGNAL =================
function getBestSignal(list){

const sizes=list.map(i=>getSize(Number(i.number)));
const colors=list.map(i=>getColor(Number(i.number)));

let s=analyzeV18(sizes,"SIZE",state.memory);
let c=analyzeV18(colors,"COLOR",state.memory);

if(s.action==="WAIT" && c.action==="WAIT")
return {action:"WAIT"};

return (s.conf||0) >= (c.conf||0) ? s : c;
}

// ================= LOOP =================
let running=false;

async function tick(){

if(running) return;
running=true;

try{

const res = await fetch(API+"&_t="+Date.now());
const data = await res.json();

const list=data.data.list;
const latest=list[0].issueNumber;
const next=(BigInt(latest)+1n).toString();

// ===== RESULT CHECK =====
if(state.activePrediction){

const result=list.find(i=>i.issueNumber===state.activePrediction.period);

if(result){

let num=Number(result.number);
let actual = state.activePrediction.type==="SIZE"
? getSize(num)
: getColor(num);

let win = actual===state.activePrediction.pred;

state.totalSignals++;

let mem = state.memory;

mem.last50.unshift({
type:state.activePrediction.type,
mode:state.activePrediction.mode,
win
});

if(mem.last50.length>50) mem.last50.pop();

if(win){
state.wins++;
state.currentLevel=0;

if(state.activePrediction.type==="SIZE") mem.sizeWins++;
if(state.activePrediction.type==="COLOR") mem.colorWins++;

if(state.activePrediction.mode==="Momentum") mem.trendWins++;
if(state.activePrediction.mode==="Reversal") mem.reversalWins++;
}
else{
state.currentLevel++;

mem.lossPatterns.push({
type:state.activePrediction.type,
mode:state.activePrediction.mode
});

if(mem.lossPatterns.length>10)
mem.lossPatterns.shift();

if(state.currentLevel>=FUND_LEVELS.length){
await sendTelegram("🛑 HARD STOP ACTIVATED");
state.currentLevel=0;
}
}

state.activePrediction=null;
saveState();
}
}

// ===== NEW SIGNAL =====
if(state.lastProcessedIssue!==latest && !state.activePrediction){

const signal=getBestSignal(list);

if(signal.action==="WAIT"){

await sendTelegram(`
📡 V18 RADAR
Period: ${next.slice(-4)}
Action: WAIT
Reason: No Safe Edge
Level: ${state.currentLevel+1}
`);

}
else{

let bet=FUND_LEVELS[state.currentLevel];

await sendTelegram(`
⚡ V18 SIGNAL
Period: ${next.slice(-4)}
Type: ${signal.type}
Prediction: ${signal.action}
Confidence: ${signal.conf}%
Mode: ${signal.mode}
Level: ${state.currentLevel+1}
Bet: ${bet}
`);

state.activePrediction={
period:next,
pred:signal.action,
type:signal.type,
mode:signal.mode
};
}

state.lastProcessedIssue=latest;
saveState();
}

}catch(e){}

running=false;
}

setInterval(tick,2500);
tick();
