const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 WEB MONITOR (Keeps the cloud host awake)
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050510; color:#00ff9d; font-family:monospace; text-align:center; padding:50px;">
            <h2>🟢 KIRA QUANTUM V7 CLOUD SERVER IS ONLINE</h2>
            <p>The AI is currently analyzing the markets in the background.</p>
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p>
        </body>
    `);
});
app.listen(PORT, () => console.log(`🚀 Kira Cloud Server listening on port ${PORT}`));

// ==========================================
// ⚙️ TELEGRAM & API CONFIGURATION
// ==========================================
const BOT_TOKEN = "8561861801:AAE8stFdYnAYuiXURg5esS-caURtIzx6gRg";
const TARGET_CHATS = ["1669843747", "-1002613316641"];
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";
const FUND_LEVELS = [10, 20, 40, 80, 160, 320];

// 🛡️ SERVER STEALTH HEADERS
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://www.dmwin2.com",
    "Referer": "https://www.dmwin2.com/"
};

// ==========================================
// 🧠 MEMORY & STATE (File System)
// ==========================================
const STATE_FILE = './kira_state.json';
let state = {
    lastProcessedIssue: null,
    activePrediction: null, 
    totalSignals: 0,
    wins: 0,
    isStarted: false,
    currentLevel: 0
};

function loadState() {
    if (fs.existsSync(STATE_FILE)) {
        try {
            state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch(e) {
            console.log("Memory file corrupted. Booting fresh.");
        }
    }
}
function saveState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
loadState();

// ==========================================
// 📨 VIP TELEGRAM SENDER
// ==========================================
async function sendTelegram(text) {
    for (let chat_id of TARGET_CHATS) {
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chat_id, text: text, parse_mode: 'HTML' })
            });
        } catch(e) { 
            console.error(`TG Delivery Error to ${chat_id}:`, e.message); 
        }
    }
}

if (!state.isStarted) {
    let bootMsg = `🟢 <b>KIRA QUANTUM V7 CLOUD SERVER ONLINE</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Bot successfully migrated to 24/7 Cloud Engine.\nAuto-Fund Manager Activated.</i>`;
    sendTelegram(bootMsg);
    state.isStarted = true; saveState();
}

// ==========================================
// 🧠 QUANTUM V7 BRAIN (HYBRID ENGINE)
// ==========================================
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; }
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; }

function analyzeArray(arr, typeLabel) {
    let prediction = "WAIT"; let confidence = 0; let analysisText = "";
    
    let chopCount = 0;
    for(let i=0; i < 4; i++) { if(arr[i] !== arr[i+1]) chopCount++; }
    
    if(chopCount >= 3) {
        let oppA = typeLabel === "SIZE" ? "BIG" : "GREEN";
        let oppB = typeLabel === "SIZE" ? "SMALL" : "RED";
        prediction = arr[0] === oppA ? oppB : oppA;
        confidence = 75 + (chopCount * 2);
        return { type: typeLabel, action: prediction, conf: Math.min(confidence, 92), reason: "Alternating Market (Chop Play)" };
    }

    let streak = 1;
    for(let i=1; i<arr.length; i++) { if(arr[i] === arr[0]) streak++; else break; }
    if(streak >= 2) {
        if(streak >= 5) {
            let oppA = typeLabel === "SIZE" ? "BIG" : "GREEN";
            let oppB = typeLabel === "SIZE" ? "SMALL" : "RED";
            prediction = arr[0] === oppA ? oppB : oppA;
            confidence = 80 + streak; analysisText = "Streak Exhaustion / Flip";
        } else {
            prediction = arr[0]; confidence = 78 + (streak * 2); analysisText = "Strong Trend Continuation";
        }
        return { type: typeLabel, action: prediction, conf: Math.min(confidence, 96), reason: analysisText };
    }

    let valA = typeLabel === "SIZE" ? "BIG" : "RED";
    let valB = typeLabel === "SIZE" ? "SMALL" : "GREEN";
    let aToA = 0, aToB = 0, bToB = 0, bToA = 0;
    let chainLength = Math.min(20, arr.length - 1);
    
    for(let i=0; i < chainLength; i++) {
        let current = arr[i], previous = arr[i+1]; 
        if(previous === valA && current === valA) aToA++;
        if(previous === valA && current === valB) aToB++;
        if(previous === valB && current === valB) bToB++;
        if(previous === valB && current === valA) bToA++;
    }

    if (arr[0] === valA) {
        let total = aToA + aToB;
        if(total > 0) {
            let prob = (aToA / total) * 100;
            if(prob > 50) { prediction = valA; confidence = prob; analysisText = "Statistical Trend Bias"; }
            else if(prob < 50) { prediction = valB; confidence = 100 - prob; analysisText = "Statistical Flip Bias"; }
        }
    } else {
        let total = bToB + bToA;
        if(total > 0) {
            let prob = (bToB / total) * 100;
            if(prob > 50) { prediction = valB; confidence = prob; analysisText = "Statistical Trend Bias"; }
            else if(prob < 50) { prediction = valA; confidence = 100 - prob; analysisText = "Statistical Flip Bias"; }
        }
    }

    confidence += 20; confidence = Math.min(Math.round(confidence), 95); 
    if(confidence >= 65 && prediction !== "WAIT") return { type: typeLabel, action: prediction, conf: confidence, reason: analysisText };
    return { type: typeLabel, action: "WAIT", conf: 0, reason: "DEADLOCK" };
}

function analyzeQuantumHybrid(list) {
    if(!list || list.length < 5) return { type: "NONE", action: "WAIT", conf: 0, reason: "NOT ENOUGH DATA" };
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    let sizeSignal = analyzeArray(sizes, "SIZE");
    let colorSignal = analyzeArray(colors, "COLOR");
    let bestSignal = (sizeSignal.conf > colorSignal.conf) ? sizeSignal : colorSignal;
    if(bestSignal.conf >= 65 && bestSignal.action !== "WAIT") return bestSignal;
    return { type: "NONE", action: "WAIT", conf: 0, reason: "NO CLEAR STATISTICAL EDGE" };
}

// ==========================================
// ⚙️ SERVER MAIN LOOP
// ==========================================
let isProcessing = false; 

async function tick() {
    if(isProcessing) return; 
    isProcessing = true;

    try {
        const res = await fetch(API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 10000 });
        const data = await res.json();
        
        if(!data.data || !data.data.list) throw new Error("Invalid API Response");
        
        const list = data.data.list;
        const latestIssue = list[0].issueNumber;
        const targetIssue = (BigInt(latestIssue) + 1n).toString();
        
        console.log(`[${new Date().toLocaleTimeString()}] Target Period: ${targetIssue.slice(-4)}`);

        // 🚨 ANTI-HANG OVERRIDE: If the bot missed a period by more than 2 rounds, force a reset
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) {
            console.log(`⚠️ MISSED RESULT for Period ${state.activePrediction.period}. Forcing reset to protect loop.`);
            state.activePrediction = null;
            saveState();
        }

        // 1️⃣ CHECK PREVIOUS RESULT
        if(state.activePrediction) {
            if(BigInt(latestIssue) >= BigInt(state.activePrediction.period)) {
                const resultItem = list.find(i => i.issueNumber === state.activePrediction.period);
                
                if(resultItem) {
                    let actualNum = Number(resultItem.number);
                    let actualResult = state.activePrediction.type === "SIZE" ? getSize(actualNum) : getColor(actualNum);
                    let isWin = (actualResult === state.activePrediction.pred);
                    
                    state.totalSignals++;
                    if(isWin) { state.wins++; state.currentLevel = 0; } 
                    else {
                        state.currentLevel++;
                        if(state.currentLevel >= FUND_LEVELS.length) state.currentLevel = 0; 
                    }
                    
                    let currentAccuracy = Math.round((state.wins / state.totalSignals) * 100);
                    
                    let resMsg = isWin ? `✅ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐄𝐋𝐈𝐌𝐈𝐍𝐀𝐓𝐄𝐃</b> ✅\n` : `❌ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐌𝐈𝐒𝐒𝐄𝐃</b> ❌\n`;
                    resMsg += `━━━━━━━━━━━━━━━━━━\n`;
                    resMsg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${state.activePrediction.period.slice(-4)}</code>\n`;
                    resMsg += `🎲 𝐑𝐞𝐬𝐮𝐥𝐭: <b>${actualNum} (${actualResult})</b>\n`;
                    if(isWin) resMsg += `💰 𝐒𝐭𝐚𝐭𝐮𝐬: <b>PROFIT SECURED! (Level 1 Reset)</b>\n`;
                    else resMsg += `🛡️ 𝐒𝐭𝐚𝐭𝐮𝐬: Moving to Level ${state.currentLevel + 1}...\n`;
                    resMsg += `📈 𝐀𝐜𝐜𝐮𝐫𝐚𝐜𝐲: ${currentAccuracy}%\n`;
                    resMsg += `━━━━━━━━━━━━━━━━━━`;

                    await sendTelegram(resMsg);
                    console.log(`[${state.activePrediction.period.slice(-4)}] Result: ${isWin ? 'WIN' : 'LOSS'}`);
                } 
                state.activePrediction = null; saveState();
            }
        }

        // 2️⃣ GENERATE NEW PREDICTION
        if(state.lastProcessedIssue !== latestIssue) {
            if(!state.activePrediction) {
                const signal = analyzeQuantumHybrid(list);
                
                if(signal && signal.action === "WAIT") {
                    let msg = `⏸ <b>𝐌𝐀𝐑𝐊𝐄𝐓 𝐒𝐂𝐀𝐍 | 𝐏𝐞𝐫𝐢𝐨𝐝: ${targetIssue.slice(-4)}</b>\n\n⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> WAIT\n📉 <b>𝐑𝐞𝐚𝐬𝐨𝐧:</b> ${signal.reason}`;
                    await sendTelegram(msg);
                    console.log(`[${targetIssue.slice(-4)}] Action: WAIT`);
                } else if(signal) {
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏";
                    let riskLevel = signal.conf > 85 ? "🟢 Low Risk" : "🟡 Med Risk";
                    let betAmount = FUND_LEVELS[state.currentLevel];
                    
                    let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐀𝐈 ⚡️\n`;
                    msg += `━━━━━━━━━━━━━━━━━━\n`;
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`;
                    msg += `${signalEmoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n`;
                    msg += `🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n`;
                    msg += `📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${signal.conf}%\n`;
                    msg += `━━━━━━━━━━━━━━━━━━\n`;
                    msg += `💰 <b>𝐔𝐒𝐄 𝐋𝐄𝐕𝐄𝐋 ${state.currentLevel + 1} 𝐅𝐔𝐍𝐃: Rs. ${betAmount}</b>\n`;
                    msg += `💡 <i>${signal.reason}</i>`;
                    
                    await sendTelegram(msg);
                    console.log(`[${targetIssue.slice(-4)}] Signal Fired: ${signal.action}`);
                    
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf };
                    saveState();
                }
            }
            state.lastProcessedIssue = latestIssue; saveState();
        }
    } catch (e) {
        console.error("API Fetch Error - Will retry next tick.");
    } finally {
        isProcessing = false; 
    }
}

// Server checks the market every 2 seconds
setInterval(tick, 2000);
tick();
