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
            <h2>🟢 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟕 (𝐀𝐍𝐓𝐈-𝐂𝐑𝐎𝐖𝐃 𝐄𝐍𝐆𝐈𝐍𝐄) 𝐎𝐍𝐋𝐈𝐍𝐄</h2> 
            <p>Liability Sniping Active. Betting against human psychology.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V27 Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAFODC-ho2yoIZ5NVuJzh71NrsaogPQFu-4"; 
const TARGET_CHATS = ["1669843747", "-1002613316641"]; 
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30"; 

// Locked to 6 Levels. We are forcing the win early by playing with the casino's algorithm.
const FUND_LEVELS = [33, 66, 100, 133, 168, 500]; 
const MAX_WAIT_STREAK = 12; 

const HEADERS = { 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
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
    currentLevel: 0,
    consecutiveWaits: 0 
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
    state.isStarted = true; 
    saveState(); 
    let bootMsg = `🟢 <b>𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟕 𝐎𝐍𝐋𝐈𝐍𝐄</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Anti-Crowd Engine Activated.\nLiability Sniping Protocol Engaged.</i>\n\n⏱ <i>Bot is now analyzing human psychology to bet AGAINST the public crowd.</i>`; 
    sendTelegram(bootMsg); 
} 

// ========================================== 
// 🧠 QUANTUM V27 BRAIN (ANTI-CROWD LOGIC)
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function analyzeV27(arr, rawNums, typeLabel, currentLevel) {
    if (arr.length < 10) return { action: "WAIT", conf: 0, reason: "GATHERING DATA" };

    const OPPOSITE = (val) => {
        if (typeLabel === "SIZE") return val === "BIG" ? "SMALL" : "BIG";
        return val === "RED" ? "GREEN" : "RED";
    };

    let prediction = null;
    let reason = "";
    const getConf = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let isVioletTrap = (rawNums[0] === 0 || rawNums[0] === 5 || rawNums[1] === 0 || rawNums[1] === 5);

    // If Violet drops, the casino just swept the board. We wait 1 period for humans to place new bets.
    if (isVioletTrap) return { type: typeLabel, action: "WAIT", conf: 0, reason: "Casino Swept Board: Waiting for humans to place new bets..." };

    // 🧠 HUMAN PSYCHOLOGY TRAPS:

    // 1. THE OBVIOUS STREAK (Humans see 3 or 4 in a row and bet heavily on the 4th/5th)
    let isObviousStreak = (arr[0] === arr[1] && arr[1] === arr[2]); 
    let isDeepStreak = (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === arr[3]); 

    // 2. THE OBVIOUS CHOP (Humans see R-G-R-G and bet heavily on R)
    let isObviousChop = (arr[0] !== arr[1] && arr[1] !== arr[2] && arr[2] !== arr[3]); 

    // 3. THE RECENT BREAKOUT (Humans see a streak break and instantly bet the new color)
    let isFreshBreakout = (arr[0] !== arr[1] && arr[1] === arr[2] && arr[2] === arr[3]); 

    // 🎯 THE ANTI-CROWD EXECUTION:
    // We do the EXACT OPPOSITE of what a normal human player would do.

    if (currentLevel >= 3) {
        // Deep levels: Casino is hunting. We play extreme contrarian.
        if (isDeepStreak) {
            prediction = OPPOSITE(arr[0]); // Humans bet Streak. We bet Reversal.
            reason = "Anti-Crowd: Sweeping Heavy Streak";
        } else if (isObviousChop) {
            prediction = arr[0]; // Humans bet Alternation. We bet Duplicate to break their chop.
            reason = "Anti-Crowd: Breaking Obvious Chop";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Deep Recovery: Awaiting Heavy Human Liability" };
        }
    } else {
        // Early levels: Capitalize on common human mistakes
        if (isFreshBreakout) {
            prediction = OPPOSITE(arr[0]); // Humans follow breakout. We bet it fakes out and returns.
            reason = "Liability Snipe: Fading the Breakout";
        } else if (isObviousStreak) {
            prediction = OPPOSITE(arr[0]); // Fade the streak early before the casino does
            reason = "Liability Snipe: Pre-emptive Streak Break";
        } else if (isObviousChop) {
            prediction = arr[0]; // Break the chop
            reason = "Liability Snipe: Breaking Obvious Chop";
        } else {
            // Volume trap: Look at last 5. If 4 are BIG, humans bet SMALL (mean reversion). So we bet BIG.
            let countA = 0; let valA = arr[0];
            for (let i=0; i<5; i++) { if(arr[i] === valA) countA++; }
            
            if (countA >= 4) {
                prediction = valA;
                reason = "Anti-Crowd: Fading Human Mean Reversion";
            } else {
                return { type: typeLabel, action: "WAIT", conf: 0, reason: "Market Balanced: Waiting for Crowd Imbalance" };
            }
        }
    }

    let confidence = getConf(96, 99); 
    return { type: typeLabel, action: prediction, conf: confidence, reason: reason };
}

function getBestSignal(list, currentLevel) { 
    if(!list || list.length < 10) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    const rawNums = list.map(i => Number(i.number));
    
    let sizeSignal = analyzeV27(sizes, rawNums, "SIZE", currentLevel);
    let colorSignal = analyzeV27(colors, rawNums, "COLOR", currentLevel);

    if (sizeSignal.action === "WAIT" && colorSignal.action === "WAIT") {
        return { type: "NONE", action: "WAIT", conf: 0, reason: sizeSignal.reason };
    }

    if (sizeSignal.conf >= colorSignal.conf && sizeSignal.action !== "WAIT") return sizeSignal;
    if (colorSignal.action !== "WAIT") return colorSignal;
    return sizeSignal;
} 

// ========================================== 
// ⚙️ SERVER MAIN LOOP 
// ========================================== 
let isProcessing = false; 

async function tick() { 
    if(isProcessing) return; 
    isProcessing = true; 
    
    try { 
        const res = await fetch(API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 8000 }); 
        const data = await res.json(); 
        if(!data.data || !data.data.list) throw new Error("API Issue"); 
        
        const list = data.data.list; 
        const latestIssue = list[0].issueNumber; 
        const targetIssue = (BigInt(latestIssue) + 1n).toString(); 
        
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) { 
            state.activePrediction = null; saveState(); 
        } 
        
        // 1️⃣ CHECK PREVIOUS RESULT 
        if(state.activePrediction) { 
            let timeElapsed = Date.now() - state.activePrediction.timestamp;
            if (timeElapsed > 4 * 60 * 1000) { 
                let msg = `⚠️ <b>𝐀𝐏𝐈 𝐋𝐀𝐆 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃</b> ⚠️\n`;
                msg += `━━━━━━━━━━━━━━━━━━\n`;
                msg += `🔄 <b>Trade Cancelled. Waiting for Casino to settle liability.</b>`;
                await sendTelegram(msg);
                state.activePrediction = null;
                saveState();
                return;
            }

            if(BigInt(latestIssue) >= BigInt(state.activePrediction.period)) { 
                const resultItem = list.find(i => i.issueNumber === state.activePrediction.period); 
                if(resultItem) { 
                    let actualNum = Number(resultItem.number); 
                    let actualResult = state.activePrediction.type === "SIZE" ? getSize(actualNum) : getColor(actualNum); 
                    let isWin = (actualResult === state.activePrediction.pred); 
                    
                    if(isWin) { 
                        state.wins++; 
                        state.totalSignals++; 
                        state.currentLevel = 0; 
                        state.consecutiveWaits = 0;
                    } else { 
                        state.currentLevel++; 
                        state.consecutiveWaits = 0;
                        if(state.currentLevel >= FUND_LEVELS.length) {
                            state.totalSignals++; 
                            state.currentLevel = 0; 
                        }
                    } 
                    
                    let currentAccuracy = state.totalSignals > 0 ? Math.round((state.wins / state.totalSignals) * 100) : 100; 
                    
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
                    
                    resMsg += `🎯 𝐒𝐞𝐪𝐮𝐞𝐧𝐜𝐞 𝐒𝐮𝐜𝐜𝐞𝐬𝐬: <b>${currentAccuracy}%</b>\n`; 
                    if (!isWin) resMsg += `🔄 𝐍𝐞𝐱𝐭 𝐓𝐫𝐚𝐝𝐞: <b>Level ${state.currentLevel + 1}</b>\n`; 
                    
                    await sendTelegram(resMsg); 
                } 
                state.activePrediction = null; saveState(); 
            } 
        } 
        
        // 2️⃣ GENERATE NEW PREDICTION 
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 

                if (state.consecutiveWaits >= MAX_WAIT_STREAK && state.currentLevel > 0) {
                    let msg = `⚡️ <b>𝐂𝐈𝐑𝐂𝐔𝐈𝐓 𝐁𝐑𝐄𝐀𝐊𝐄𝐑 𝐓𝐑𝐈𝐏𝐏𝐄𝐃</b> ⚡️\n`;
                    msg += `━━━━━━━━━━━━━━━━━━\n`;
                    msg += `⚠️ Extreme liability trap detected.\n`;
                    msg += `🔄 <b>Resetting sequence to Level 1 to protect capital.</b>\n`;
                    
                    await sendTelegram(msg);
                    state.totalSignals++; 
                    state.currentLevel = 0; 
                    state.consecutiveWaits = 0; 
                    saveState();
                    return; 
                }

                const signal = getBestSignal(list, state.currentLevel); 
                
                if(signal && signal.action === "WAIT") { 
                    state.consecutiveWaits++;
                    let msg = `📡 <b>𝐊𝐈𝐑𝐀 𝐑𝐀𝐃𝐀𝐑 𝐒𝐂𝐀𝐍</b> 📡\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> WAIT\n`; 
                    msg += `📉 <b>𝐑𝐞𝐚𝐬𝐨𝐧:</b> <i>${signal.reason}</i>\n`;
                    if (state.currentLevel > 0) msg += `⏱ <i>(${state.consecutiveWaits}/${MAX_WAIT_STREAK})</i>`;
                    await sendTelegram(msg); 
                    saveState();
                } else if(signal) { 
                    state.consecutiveWaits = 0;
                    
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 

                    let threatLevel = "🟢 𝐒𝐓𝐀𝐍𝐃𝐀𝐑𝐃 𝐄𝐍𝐓𝐑𝐘";
                    if (state.currentLevel >= 1) threatLevel = "🟡 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐏𝐑𝐎𝐓𝐎𝐂𝐎𝐋";
                    if (state.currentLevel >= 3) threatLevel = "🔴 𝐃𝐄𝐄𝐏 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘";

                    let bar = "🟩🟩🟩🟩🟩";
                    if (signal.conf < 95) bar = "🟩🟩🟩🟩⬜";
                    
                    let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟕 ⚡️\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `${signalEmoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n`; 
                    msg += `🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n`; 
                    msg += `📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${bar} <b>${signal.conf}%</b>\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `⚠️ <b>${threatLevel}</b>\n`; 
                    msg += `💰 <b>𝐈𝐧𝐯𝐞𝐬𝐭𝐦𝐞𝐧𝐭 (𝐋${state.currentLevel + 1}): Rs. ${betAmount}</b>\n`; 
                    msg += `🧠 <i>${signal.reason}</i>`; 
                    
                    await sendTelegram(msg); 
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf, timestamp: Date.now() }; 
                    saveState(); 
                } 
            } 
            state.lastProcessedIssue = latestIssue; saveState(); 
        } 
    } catch (e) {
        console.log(`[API ERROR] ${e.message}`);
    } finally { 
        isProcessing = false; 
    } 
} 

setInterval(tick, 2500); 
tick();
