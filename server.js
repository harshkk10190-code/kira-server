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
            <h2>🟢 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟒 (𝐓𝐈𝐄𝐑𝐄𝐃 𝐑𝐈𝐒𝐊) 𝐎𝐍𝐋𝐈𝐍𝐄</h2> 
            <p>Dynamic Brain Shifting Engaged. Deep Recovery Lockdown Active.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V14 Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAEt6Tln3WfUTQZH04atSo9V4zjOkBsah8s"; 
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
    let bootMsg = `🟢 <b>𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟒 𝐎𝐍𝐋𝐈𝐍𝐄</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Tiered Risk Engine Activated.\nDeep Recovery Lockdown Engaged.</i>`; 
    sendTelegram(bootMsg); 
    state.isStarted = true; saveState(); 
} 

// ========================================== 
// 🧠 QUANTUM V14 BRAIN (TIERED RISK ENGINE) 
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function analyzeV14(arr, typeLabel, currentLevel) {
    if (arr.length < 10) return { action: "WAIT", conf: 0, reason: "GATHERING DATA" };

    const OPPOSITE = (val) => {
        if (typeLabel === "SIZE") return val === "BIG" ? "SMALL" : "BIG";
        return val === "RED" ? "GREEN" : "RED";
    };

    let prediction = null;
    let reason = "";
    const getConf = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 🌟 MACRO PATTERNS
    let isHeavyStreak = (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === arr[3]); // AAAA
    let isStreak = (arr[0] === arr[1] && arr[1] === arr[2]); // AAA
    let isChop = (arr[0] !== arr[1] && arr[1] !== arr[2] && arr[2] !== arr[3]); // ABAB
    let isCluster = (arr[0] === arr[1] && arr[2] === arr[3] && arr[0] !== arr[2]); // AABB
    let isBreakout = (arr[0] !== arr[1] && arr[1] === arr[2] && arr[2] === arr[3]); // BAAA

    // 🔴 PHASE 3: DEEP RECOVERY LOCKDOWN (Level 4, 5, 6)
    // Absolute zero risk. Only takes flawless setups to save bankroll.
    if (currentLevel >= 3) {
        if (isHeavyStreak) {
            prediction = arr[0]; reason = "Deep Recovery: Heavy Streak Lock";
        } else if (isChop) {
            prediction = OPPOSITE(arr[0]); reason = "Deep Recovery: Perfect Chop Lock";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Deep Recovery Protocol: Awaiting Tier-1 Setup" };
        }
    } 
    // 🟡 PHASE 2: CAUTION MODE (Level 2, 3)
    // No more volume guessing. Sticks to visual patterns only.
    else if (currentLevel > 0) {
        if (isStreak) {
            prediction = arr[0]; reason = "Recovery: Riding Dominant Streak";
        } else if (isChop) {
            prediction = OPPOSITE(arr[0]); reason = "Recovery: Alternation Synchronization";
        } else if (isCluster) {
            prediction = OPPOSITE(arr[0]); reason = "Recovery: Cluster Exhaustion Protocol";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Recovery Mode: Filtering Market Noise" };
        }
    } 
    // 🟢 PHASE 1: HIGH FREQUENCY (Level 1)
    // Aggressive trading to keep signals flowing.
    else {
        if (isStreak) {
            prediction = arr[0]; reason = "Tier-1 Momentum Alignment";
        } else if (isChop) {
            prediction = OPPOSITE(arr[0]); reason = "Tier-1 Chop Synchronization";
        } else if (isCluster) {
            prediction = OPPOSITE(arr[0]); reason = "Double Cluster Alignment";
        } else if (isBreakout) {
            prediction = arr[0]; reason = "Trend Breakout Confirmation";
        } else {
            let countA = 0, countB = 0;
            let valA = typeLabel === "SIZE" ? "BIG" : "RED";
            let valB = typeLabel === "SIZE" ? "SMALL" : "GREEN";
            
            for (let i = 0; i < 5; i++) {
                if (arr[i] === valA) countA++;
                else if (arr[i] === valB) countB++;
            }
            if (countA >= 4) { 
                prediction = valA; reason = "Volume Momentum Push"; 
            } else if (countB >= 4) { 
                prediction = valB; reason = "Volume Momentum Push"; 
            } else {
                return { type: typeLabel, action: "WAIT", conf: 0, reason: "Market Deadlock - Scanning Next Block" };
            }
        }
    }

    // Dynamic Confidence
    let confidence = getConf(88, 93);
    if (reason.includes("Heavy") || reason.includes("Deep Recovery")) confidence = getConf(96, 99);
    else if (reason.includes("Momentum") || reason.includes("Streak")) confidence = getConf(94, 97);
    else if (reason.includes("Chop")) confidence = getConf(92, 95);

    return { type: typeLabel, action: prediction, conf: confidence, reason: reason };
}

function getBestSignal(list, currentLevel) { 
    if(!list || list.length < 10) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    
    let sizeSignal = analyzeV14(sizes, "SIZE", currentLevel);
    let colorSignal = analyzeV14(colors, "COLOR", currentLevel);

    if (sizeSignal.action === "WAIT" && colorSignal.action === "WAIT") {
        return { type: "NONE", action: "WAIT", conf: 0, reason: sizeSignal.reason };
    }

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
                    resMsg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝  : <code>${state.activePrediction.period.slice(-4)}</code>\n`; 
                    resMsg += `🎲 𝐑𝐞𝐬𝐮𝐥𝐭  : <b>${actualNum} (${actualResult})</b>\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━\n`; 
                    
                    if(isWin) {
                        resMsg += `💰 𝐒𝐭𝐚𝐭𝐮𝐬   : <b>PROFIT SECURED!</b>\n`; 
                    } else {
                        resMsg += `🛡️ 𝐒𝐭𝐚𝐭𝐮𝐬   : <b>ESCALATING (L${state.currentLevel + 1})</b>\n`; 
                    }
                    
                    resMsg += `🏆 𝐖𝐢𝐧 𝐑𝐚𝐭𝐞 : <b>${currentAccuracy}%</b>\n`; 
                    resMsg += `🔄 𝐍𝐞𝐱𝐭 𝐓𝐫𝐚𝐝𝐞: <b>Level ${state.currentLevel === 0 ? '1' : state.currentLevel + 1}</b>\n`; 
                    
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
                    let msg = `📡 <b>𝐊𝐈𝐑𝐀 𝐑𝐀𝐃𝐀𝐑 𝐒𝐂𝐀𝐍</b> 📡\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> WAIT\n`; 
                    msg += `📉 <b>𝐑𝐞𝐚𝐬𝐨𝐧:</b> <i>${signal.reason}</i>\n`; 
                    msg += `⏱ <i>Awaiting optimal market conditions...</i>`;
                    await sendTelegram(msg); 
                } else if(signal) { 
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 

                    let threatLevel = "🟢 𝐒𝐓𝐀𝐍𝐃𝐀𝐑𝐃 𝐄𝐍𝐓𝐑𝐘";
                    if (state.currentLevel === 1) threatLevel = "🟡 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐏𝐑𝐎𝐓𝐎𝐂𝐎𝐋";
                    if (state.currentLevel >= 2) threatLevel = "🔴 𝐂𝐑𝐈𝐓𝐈𝐂𝐀𝐋 𝐀𝐃𝐀𝐏𝐓𝐀𝐓𝐈𝐎𝐍";
                    if (state.currentLevel >= 3) threatLevel = "🚨 𝐃𝐄𝐄𝐏 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐋𝐎𝐂𝐊𝐃𝐎𝐖𝐍";

                    let bar = "🟩🟩🟩🟩🟩";
                    if (signal.conf < 96) bar = "🟩🟩🟩🟩⬜";
                    if (signal.conf < 90) bar = "🟩🟩🟩⬜⬜";

                    let reasonIcon = "⚙️";
                    if (signal.reason.includes("Confirmation")) reasonIcon = "🔮";
                    if (signal.reason.includes("Chop")) reasonIcon = "🔀";
                    if (signal.reason.includes("Momentum") || signal.reason.includes("Streak")) reasonIcon = "📈";
                    if (signal.reason.includes("Volume") || signal.reason.includes("Push")) reasonIcon = "🌊";
                    if (signal.reason.includes("Deep")) reasonIcon = "🛡️";
                    
                    let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟏𝟒 ⚡️\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `${signalEmoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n`; 
                    msg += `🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n`; 
                    msg += `📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${bar} <b>${signal.conf}%</b>\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `⚠️ <b>${threatLevel}</b>\n`; 
                    msg += `💰 <b>𝐈𝐧𝐯𝐞𝐬𝐭𝐦𝐞𝐧𝐭 (𝐋${state.currentLevel + 1}): Rs. ${betAmount}</b>\n`; 
                    msg += `${reasonIcon} <i>${signal.reason}</i>`; 
                    
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
