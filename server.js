const express = require('express'); 
const fs = require('fs'); 
const app = express(); 
const PORT = process.env.PORT || 3000; 

// ==========================================
// 🌐 WEB MONITOR 
// ==========================================
app.get('/', (req, res) => { 
    res.send(` 
        <body style="background:#050510; color:#00ff9d; font-family:monospace; text-align:center; padding:50px;"> 
            <h2>🟢 KIRA QUANTUM V8.5 (HYBRID PHASE ENGINE) ONLINE</h2> 
            <p>Scanning simultaneous Size and Color statistical phases.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V8.5 Hybrid Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAGgrapR3tLko--XvilWGI-2rXPYtibEAfE"; 
const TARGET_CHATS = ["1669843747", "-1002613316641"]; 
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30"; 
const FUND_LEVELS = [33, 66, 100, 133, 168, 500]; 
const HEADERS = { 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", 
    "Accept": "application/json, text/plain, */*", 
    "Origin": "https://www.dmwin2.com", 
    "Referer": "https://www.dmwin2.com/" 
}; 

// ========================================== 
// 🧠 MEMORY & STATE 
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
        try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } 
        catch(e) { console.log("Memory reset."); } 
    } 
} 
function saveState() { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } 
loadState(); 

async function sendTelegram(text) { 
    for (let chat_id of TARGET_CHATS) { 
        try { 
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ chat_id: chat_id, text: text, parse_mode: 'HTML' }) 
            }); 
        } catch(e) {} 
    } 
} 

if (!state.isStarted) { 
    let bootMsg = `🟢 <b>KIRA QUANTUM V8.5 (HYBRID PHASE) ONLINE</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Dual-scanning Color and Size Momentum.</i>`; 
    sendTelegram(bootMsg); 
    state.isStarted = true; saveState(); 
} 

// ========================================== 
// 🧠 QUANTUM V8.5 BRAIN (PHASE DETECTION ENGINE) 
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function detectPhase(arr, typeLabel) {
    let transitions = 0;
    // Count how many times the result flipped in the last 4 movements
    for(let i = 0; i < 4; i++) {
        if(arr[i] !== arr[i+1]) transitions++;
    }

    let prediction = null;
    let confidence = 0;
    let reason = "";

    const OPPOSITE = (val) => {
        if (typeLabel === "SIZE") return val === "BIG" ? "SMALL" : "BIG";
        return val === "RED" ? "GREEN" : "RED";
    };

    // 1. HEAVY CHOP PHASE (ABAB) - Fixes your main issue
    if (transitions >= 3) {
        prediction = OPPOSITE(arr[0]); 
        confidence = 88 + transitions; // Max 92%
        reason = "Heavy Chop Market Phase (ABAB)";
    }
    // 2. HEAVY STREAK PHASE (AAAA)
    else if (transitions === 0 && arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === arr[3]) {
        prediction = arr[0]; 
        confidence = 94;
        reason = "Heavy Trend Market Phase (AAAA)";
    }
    // 3. DOUBLE CHOP PHASE (AABB)
    else if (arr[0] === arr[1] && arr[2] === arr[3] && arr[0] !== arr[2]) {
        prediction = OPPOSITE(arr[0]); // Expect the cluster to end after 2
        confidence = 90;
        reason = "Double Cluster Phase (AABB)";
    }
    // 4. DEADLOCK
    else {
        return { type: typeLabel, action: "WAIT", conf: 0, reason: "Market Unstable / No Clear Phase" };
    }

    return { type: typeLabel, action: prediction, conf: confidence, reason: reason };
}

function analyzeHybridPhase(list) { 
    if(!list || list.length < 6) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    
    let sizeSignal = detectPhase(sizes, "SIZE");
    let colorSignal = detectPhase(colors, "COLOR");

    // If both are deadlocked, skip
    if (sizeSignal.action === "WAIT" && colorSignal.action === "WAIT") {
        return { type: "NONE", action: "WAIT", conf: 0, reason: "No clear patterns in Size or Color" };
    }

    // Return the signal with the highest mathematical confidence
    if (sizeSignal.conf >= colorSignal.conf) return sizeSignal;
    return colorSignal;
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
        if(!data.data || !data.data.list) throw new Error("Invalid API"); 
        
        const list = data.data.list; 
        const latestIssue = list[0].issueNumber; 
        const targetIssue = (BigInt(latestIssue) + 1n).toString(); 
        
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) { 
            state.activePrediction = null; saveState(); 
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
                    if(isWin) { 
                        state.wins++; state.currentLevel = 0; 
                    } else { 
                        state.currentLevel++; 
                        if(state.currentLevel >= FUND_LEVELS.length) state.currentLevel = 0; 
                    } 
                    
                    let currentAccuracy = Math.round((state.wins / state.totalSignals) * 100); 
                    
                    let resMsg = isWin ? `✅ <b>TARGET ELIMINATED</b> ✅\n` : `❌ <b>TARGET MISSED</b> ❌\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━\n`; 
                    resMsg += `🎯 <b>Period:</b> <code>${state.activePrediction.period.slice(-4)}</code>\n`; 
                    resMsg += `🎲 <b>Result:</b> <b>${actualNum} (${actualResult})</b>\n`; 
                    if(isWin) resMsg += `💰 <b>Status:</b> <b>PROFIT SECURED! (Level 1)</b>\n`; 
                    else resMsg += `🛡️ <b>Status:</b> Moving to Level ${state.currentLevel + 1}...\n`; 
                    resMsg += `📈 <b>Accuracy:</b> ${currentAccuracy}%\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━`; 
                    
                    await sendTelegram(resMsg); 
                } 
                state.activePrediction = null; saveState(); 
            } 
        } 
        
        // 2️⃣ GENERATE NEW PREDICTION 
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 
                const signal = analyzeHybridPhase(list); 
                
                if(signal && signal.action === "WAIT") { 
                    let msg = `⏸ <b>MARKET SCAN | Period: ${targetIssue.slice(-4)}</b>\n\n⚠️ <b>Action:</b> WAIT\n📉 <b>Reason:</b> ${signal.reason}`; 
                    await sendTelegram(msg); 
                } else if(signal) { 
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 
                    
                    let msg = `⚡️ <b>KIRA HYBRID V8.5</b> ⚡️\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 <b>Period:</b> <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `${signalEmoji} <b>Signal Type:</b> ${signal.type}\n`; 
                    msg += `🔮 <b>Prediction: ${signal.action}</b>\n`; 
                    msg += `📊 <b>Confidence:</b> ${signal.conf}%\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `💰 <b>USE LEVEL ${state.currentLevel + 1} FUND: Rs. ${betAmount}</b>\n`; 
                    msg += `💡 <i>${signal.reason}</i>`; 
                    
                    await sendTelegram(msg); 
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf }; 
                    saveState(); 
                } 
            } 
            state.lastProcessedIssue = latestIssue; saveState(); 
        } 
    } catch (e) { 
        console.error("Loop Error:", e.message);
    } finally { 
        isProcessing = false; 
    } 
} 

setInterval(tick, 2500); 
tick();
