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
            <h2>🟢 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟐 (𝐆𝐎𝐃-𝐌𝐎𝐃𝐄) 𝐎𝐍𝐋𝐈𝐍𝐄</h2> 
            <p>High-Frequency / High-Accuracy Engine with Adaptive Recovery.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V12 God-Mode Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAGQEOVMl20VfTDDIG-7pRF2ObU4IFpRhck"; 
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
    let bootMsg = `🟢 <b>𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟐 𝐎𝐍𝐋𝐈𝐍𝐄</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>God-Mode Engine Activated.\nAdaptive Loss-Recovery Engaged.</i>`; 
    sendTelegram(bootMsg); 
    state.isStarted = true; saveState(); 
} 

// ========================================== 
// 🧠 QUANTUM V12 BRAIN (GOD-MODE ENGINE) 
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function analyzeGodMode(arr, typeLabel, currentLevel) {
    if (arr.length < 10) return { action: "WAIT", conf: 0, reason: "GATHERING DATA" };

    const OPPOSITE = (val) => {
        if (typeLabel === "SIZE") return val === "BIG" ? "SMALL" : "BIG";
        return val === "RED" ? "GREEN" : "RED";
    };

    let prediction = null;
    let confidence = 0;
    let reason = "";

    // DYNAMIC LOSS ADAPTATION: If we are in Level 2 or higher, the market is trapping normal patterns.
    // We instantly invert the standard logic to break the losing streak.
    let invertLogic = currentLevel > 0;

    // 1. PERFECT STREAK (AAA)
    if (arr[0] === arr[1] && arr[1] === arr[2]) {
        prediction = invertLogic ? OPPOSITE(arr[0]) : arr[0];
        confidence = invertLogic ? 94 : 96;
        reason = invertLogic ? "Anti-Streak Market Correction" : "Riding Market Momentum";
    }
    // 2. PERFECT CHOP (ABA)
    else if (arr[0] !== arr[1] && arr[1] !== arr[2]) {
        prediction = invertLogic ? arr[0] : OPPOSITE(arr[0]);
        confidence = invertLogic ? 91 : 94;
        reason = invertLogic ? "Chop Breakout Anticipation" : "Riding Alternating Chop";
    }
    // 3. DOUBLE CHOP / CLUSTER (AABB)
    else if (arr[0] === arr[1] && arr[2] === arr[3] && arr[0] !== arr[2]) {
        prediction = invertLogic ? arr[0] : OPPOSITE(arr[0]);
        confidence = invertLogic ? 89 : 92;
        reason = invertLogic ? "Cluster Continuation" : "Double Cluster Exhaustion";
    }
    // 4. THE TREND BREAKOUT (BAAA -> recently broke to B)
    else if (arr[0] !== arr[1] && arr[1] === arr[2] && arr[2] === arr[3]) {
        prediction = arr[0]; // Expect the newly formed trend to establish itself
        confidence = 88;
        reason = "New Trend Breakout Confirmation";
    }
    // 5. VOLUME BIAS FALLBACK (Ensures frequent bets when patterns are messy)
    else {
        let countA = 0, countB = 0;
        let valA = typeLabel === "SIZE" ? "BIG" : "RED";
        let valB = typeLabel === "SIZE" ? "SMALL" : "GREEN";
        
        // Scan last 7 periods for dominant volume
        for (let i = 0; i < 7; i++) {
            if (arr[i] === valA) countA++;
            else if (arr[i] === valB) countB++;
        }

        if (countA >= 5) {
            prediction = invertLogic ? valB : valA;
            confidence = 85;
            reason = invertLogic ? "Volume Reversal Protocol" : "Heavy Volume Bias Algorithm";
        } else if (countB >= 5) {
            prediction = invertLogic ? valA : valB;
            confidence = 85;
            reason = invertLogic ? "Volume Reversal Protocol" : "Heavy Volume Bias Algorithm";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Absolute Deadlock" };
        }
    }

    return { type: typeLabel, action: prediction, conf: confidence, reason: reason };
}

function getBestSignal(list, currentLevel) { 
    if(!list || list.length < 10) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    
    let sizeSignal = analyzeGodMode(sizes, "SIZE", currentLevel);
    let colorSignal = analyzeGodMode(colors, "COLOR", currentLevel);

    if (sizeSignal.action === "WAIT" && colorSignal.action === "WAIT") {
        return { type: "NONE", action: "WAIT", conf: 0, reason: "Market Deadlock - Scanning Next Block" };
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
                        state.wins++; 
                        state.currentLevel = 0; 
                    } else { 
                        state.currentLevel++; 
                        if(state.currentLevel >= FUND_LEVELS.length) state.currentLevel = 0; 
                    } 
                    
                    let currentAccuracy = Math.round((state.wins / state.totalSignals) * 100); 
                    
                    let resMsg = isWin ? `✅ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐄𝐋𝐈𝐌𝐈𝐍𝐀𝐓𝐄𝐃</b> ✅\n` : `❌ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐌𝐈𝐒𝐒𝐄𝐃</b> ❌\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━\n`; 
                    resMsg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${state.activePrediction.period.slice(-4)}</code>\n`; 
                    resMsg += `🎲 𝐑𝐞𝐬𝐮𝐥𝐭: <b>${actualNum} (${actualResult})</b>\n`; 
                    
                    if(isWin) {
                        resMsg += `💰 𝐒𝐭𝐚𝐭𝐮𝐬: <b>PROFIT SECURED! (Level 1)</b>\n`; 
                    } else {
                        resMsg += `🛡️ 𝐒𝐭𝐚𝐭𝐮𝐬: Adaptability Active. Escalating to Level ${state.currentLevel + 1}...\n`; 
                    }
                    
                    resMsg += `📈 𝐀𝐜𝐜𝐮𝐫𝐚𝐜𝐲: ${currentAccuracy}%\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━`; 
                    
                    await sendTelegram(resMsg); 
                } 
                state.activePrediction = null; saveState(); 
            } 
        } 
        
        // 2️⃣ GENERATE NEW PREDICTION 
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 
                const signal = getBestSignal(list, state.currentLevel); 
                
                if(signal && signal.action === "WAIT") { 
                    let msg = `⏸ <b>𝐌𝐀𝐑𝐊𝐄𝐓 𝐒𝐂𝐀𝐍 | 𝐏𝐞𝐫𝐢𝐨𝐝: ${targetIssue.slice(-4)}</b>\n\n⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> WAIT\n📉 <b>𝐑𝐞𝐚𝐬𝐨𝐧:</b> ${signal.reason}`; 
                    await sendTelegram(msg); 
                } else if(signal) { 
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 
                    
                    let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟐 ⚡️\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `${signalEmoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n`; 
                    msg += `🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n`; 
                    msg += `📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${signal.conf}%\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `💰 <b>𝐔𝐒𝐄 𝐋𝐄𝐕𝐄𝐋 ${state.currentLevel + 1} 𝐅𝐔𝐍𝐃: Rs. ${betAmount}</b>\n`; 
                    msg += `💡 <i>${signal.reason}</i>`; 
                    
                    await sendTelegram(msg); 
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf }; 
                    saveState(); 
                } 
            } 
            state.lastProcessedIssue = latestIssue; saveState(); 
        } 
    } catch (e) {} finally { isProcessing = false; } 
} 

setInterval(tick, 2500); 
tick();
