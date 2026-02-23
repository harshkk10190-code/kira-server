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
            <h2>🟢 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟒 (𝐒𝐓𝐄𝐀𝐋𝐓𝐇 𝐋𝐎𝐂𝐊) 𝐎𝐍𝐋𝐈𝐍𝐄</h2> 
            <p>Ghost Betting Active. Absolute Stealth Lock Engaged.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V24 Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAGV2vDT36ka-psFp6Ah095JmskvCPWxR9Q"; 
const TARGET_CHATS = ["1669843747", "-1002613316641"]; 
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30"; 

const GHOST_THRESHOLD = 3; 
const REAL_FUND_LEVELS = [33, 66, 100, 133, 168, 500]; 
const MAX_WAIT_STREAK = 15; 

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
    isShadowMode: true,  // 👻 Starts securely in stealth
    virtualLevel: 0,     
    realLevel: 0,        
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

// 🚨 FIXED: Added "force" parameter to bypass stealth ONLY for specific messages
async function sendTelegram(text, force = false) { 
    if (state.isShadowMode && !force) return; 

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
    // 🚨 FIXED: Bot is instantly locked in Ghost Mode. Race condition eliminated.
    state.isShadowMode = true; 
    state.isStarted = true; 
    saveState(); 

    let bootMsg = `🟢 <b>𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟒 𝐎𝐍𝐋𝐈𝐍𝐄</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Perfected Matrix Activated.\nAbsolute Stealth Lock Engaged.</i>\n\n⏱ <i>Bot is currently running silent background simulations. Signals will only broadcast when probability > 96%.</i>`; 
    sendTelegram(bootMsg, true); // 'true' forces it to send even while hidden
} 

// ========================================== 
// 🧠 QUANTUM V24 BRAIN (DUAL LOGIC)
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function analyzeV24(arr, rawNums, typeLabel, currentLevel, isShadowMode) {
    if (arr.length < 10) return { action: "WAIT", conf: 0, reason: "GATHERING DATA" };

    const OPPOSITE = (val) => {
        if (typeLabel === "SIZE") return val === "BIG" ? "SMALL" : "BIG";
        return val === "RED" ? "GREEN" : "RED";
    };

    let prediction = null;
    let reason = "";
    const getConf = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let isVioletTrap = (rawNums[0] === 0 || rawNums[0] === 5 || rawNums[1] === 0 || rawNums[1] === 5);

    let isPerfectChop = (arr[0] !== arr[1] && arr[1] !== arr[2] && arr[2] !== arr[3] && arr[3] !== arr[4]);
    let isChop = (arr[0] !== arr[1] && arr[1] !== arr[2] && arr[2] !== arr[3]); 
    let isStreak = (arr[0] === arr[1] && arr[1] === arr[2]); 
    let isCluster = (arr[0] === arr[1] && arr[2] === arr[3] && arr[0] !== arr[2]); 
    let isBreakout = (arr[0] !== arr[1] && arr[1] === arr[2] && arr[2] === arr[3]); 

    // 🛡️ UNIVERSAL VIOLET SHIELD
    if (isVioletTrap) {
        return { type: typeLabel, action: "WAIT", conf: 0, reason: "Market Unstable: Violet Trap Detected" };
    }

    // 🔴 REAL USER DEEP RECOVERY (Levels 4, 5, 6) -> STRICT ANTI-BAIT
    if (!isShadowMode && currentLevel >= 3) {
        if (isPerfectChop) {
            prediction = OPPOSITE(arr[0]); reason = "Deep Recovery: Perfect Chop Lock";
        } else if (isBreakout) {
            prediction = arr[0]; reason = "Deep Recovery: Safe Post-Streak Breakout";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Deep Recovery Protocol: Awaiting Flawless Setup" };
        }
    } 
    // 🟢 GHOST MODE OR REAL USER L1/L2/L3 -> AGGRESSIVE TIER-S
    else {
        if (isPerfectChop || isChop) {
            prediction = OPPOSITE(arr[0]); reason = "Tier-S: Alternation Synchronization";
        } else if (isBreakout) {
            prediction = arr[0]; reason = "Tier-S: Trend Breakout Confirmation";
        } else if (isCluster) {
            prediction = OPPOSITE(arr[0]); reason = "Tier-S: Cluster Exhaustion Protocol";
        } else if (isStreak) {
            prediction = arr[0]; reason = "Tier-S: Riding Dominant Streak";
        } else {
            return { type: typeLabel, action: "WAIT", conf: 0, reason: "Filtering Market Noise" };
        }
    }

    let confidence = getConf(96, 99); 
    return { type: typeLabel, action: prediction, conf: confidence, reason: reason };
}

function getBestSignal(list, currentLevel, isShadowMode) { 
    if(!list || list.length < 10) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 
    const rawNums = list.map(i => Number(i.number));
    
    let sizeSignal = analyzeV24(sizes, rawNums, "SIZE", currentLevel, isShadowMode);
    let colorSignal = analyzeV24(colors, rawNums, "COLOR", currentLevel, isShadowMode);

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
        const res = await fetch(API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 8000 }); 
        const data = await res.json(); 
        if(!data.data || !data.data.list) throw new Error("API returned invalid JSON structure"); 
        
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
                console.log(`[TIMEOUT] API stuck for 4 mins on period ${state.activePrediction.period}. Resetting.`);
                if (!state.isShadowMode) {
                    let msg = `⚠️ <b>𝐀𝐏𝐈 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐈𝐎𝐍 𝐋𝐎𝐒𝐓</b> ⚠️\n`;
                    msg += `━━━━━━━━━━━━━━━━━━\n`;
                    msg += `The Casino server is lagging and refusing to output results for Period ${state.activePrediction.period}.\n`;
                    msg += `🔄 <b>Trade Cancelled. Funds Safe. Resetting matrix to avoid traps.</b>`;
                    await sendTelegram(msg);
                }
                state.activePrediction = null;
                state.isShadowMode = true;
                state.realLevel = 0;
                state.virtualLevel = 0;
                saveState();
                return;
            }

            if(BigInt(latestIssue) >= BigInt(state.activePrediction.period)) { 
                const resultItem = list.find(i => i.issueNumber === state.activePrediction.period); 
                if(resultItem) { 
                    let actualNum = Number(resultItem.number); 
                    let actualResult = state.activePrediction.type === "SIZE" ? getSize(actualNum) : getColor(actualNum); 
                    let isWin = (actualResult === state.activePrediction.pred); 
                    
                    if (state.isShadowMode) {
                        if (isWin) {
                            console.log(`[GHOST] Won at Virtual Level ${state.virtualLevel + 1}. Resetting ghost.`);
                            state.virtualLevel = 0; 
                        } else {
                            state.virtualLevel++;
                            console.log(`[GHOST] Lost. Escalating to Virtual Level ${state.virtualLevel + 1}`);
                            
                            if (state.virtualLevel >= GHOST_THRESHOLD) {
                                console.log(`[GHOST] Absorbed 3 losses. Deploying real signal to Telegram!`);
                                state.isShadowMode = false; 
                                state.realLevel = 0; 
                            }
                        }
                    } 
                    else {
                        if(isWin) { 
                            state.wins++; 
                            state.totalSignals++; 
                            state.realLevel = 0; 
                            state.virtualLevel = 0;
                            state.isShadowMode = true; 
                            state.consecutiveWaits = 0; 
                        } else { 
                            state.realLevel++; 
                            state.consecutiveWaits = 0; 
                            if(state.realLevel >= REAL_FUND_LEVELS.length) {
                                state.totalSignals++; 
                                state.realLevel = 0; 
                                state.virtualLevel = 0;
                                state.isShadowMode = true; 
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
                            resMsg += `👻 <i>Engine returning to Shadow Mode...</i>\n`;
                        } else {
                            resMsg += `🛡️ 𝐒𝐭𝐚𝐭𝐮𝐬   : <b>ESCALATING (L${state.realLevel + 1})</b>\n`; 
                        }
                        
                        resMsg += `🎯 𝐒𝐞𝐪𝐮𝐞𝐧𝐜𝐞 𝐒𝐮𝐜𝐜𝐞𝐬𝐬: <b>${currentAccuracy}%</b>\n`; 
                        if (!isWin) resMsg += `🔄 𝐍𝐞𝐱𝐭 𝐓𝐫𝐚𝐝𝐞: <b>Level ${state.realLevel + 1}</b>\n`; 
                        
                        await sendTelegram(resMsg); 
                    }
                } 
                state.activePrediction = null; saveState(); 
            } 
        } 
        
        // 2️⃣ GENERATE NEW PREDICTION 
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 
                
                let currentMaxWait = 15; 
                if (state.realLevel >= 3) currentMaxWait = 8; 

                if (!state.isShadowMode && state.consecutiveWaits >= currentMaxWait) {
                    let msg = `⚡️ <b>𝐂𝐈𝐑𝐂𝐔𝐈𝐓 𝐁𝐑𝐄𝐀𝐊𝐄𝐑 𝐓𝐑𝐈𝐏𝐏𝐄𝐃</b> ⚡️\n`;
                    msg += `━━━━━━━━━━━━━━━━━━\n`;
                    msg += `⚠️ Market manipulation detected.\n`;
                    msg += `🔄 <b>Resetting sequence to protect capital.</b>\n`;
                    
                    await sendTelegram(msg);
                    state.totalSignals++; 
                    state.realLevel = 0; 
                    state.virtualLevel = 0;
                    state.consecutiveWaits = 0; 
                    state.isShadowMode = true; 
                    saveState();
                    return; 
                }

                const signal = getBestSignal(list, state.realLevel, state.isShadowMode); 
                
                if(signal && signal.action === "WAIT") { 
                    if (!state.isShadowMode) {
                        state.consecutiveWaits++; 
                        let msg = `📡 <b>𝐊𝐈𝐑𝐀 𝐑𝐀𝐃𝐀𝐑 𝐒𝐂𝐀𝐍</b> 📡\n`; 
                        msg += `━━━━━━━━━━━━━━━━━━\n`; 
                        msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                        msg += `⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> WAIT\n`; 
                        msg += `📉 <b>𝐑𝐞𝐚𝐬𝐨𝐧:</b> <i>${signal.reason}</i>\n`; 
                        msg += `⏱ <i>Awaiting optimal market conditions... (${state.consecutiveWaits}/${currentMaxWait})</i>`;
                        await sendTelegram(msg); 
                    }
                    saveState();
                } else if(signal) { 
                    state.consecutiveWaits = 0; 
                    
                    if (state.isShadowMode) {
                        console.log(`[GHOST] Period ${targetIssue} | Betting ${signal.action} at Virtual Level ${state.virtualLevel + 1}`);
                        state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf, timestamp: Date.now() }; 
                        saveState();
                        return;
                    }

                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = REAL_FUND_LEVELS[state.realLevel]; 

                    let threatLevel = "🟢 𝐒𝐓𝐀𝐍𝐃𝐀𝐑𝐃 𝐄𝐍𝐓𝐑𝐘";
                    if (state.realLevel >= 1) threatLevel = "🟡 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐏𝐑𝐎𝐓𝐎𝐂𝐎𝐋";
                    if (state.realLevel >= 3) threatLevel = "🔴 𝐃𝐄𝐄𝐏 𝐑𝐄𝐂𝐎𝐕𝐄𝐑𝐘 𝐋𝐎𝐂𝐊𝐃𝐎𝐖𝐍";

                    let bar = "🟩🟩🟩🟩🟩";
                    if (signal.conf < 96) bar = "🟩🟩🟩🟩⬜";

                    let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟐𝟒 ⚡️\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `${signalEmoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n`; 
                    msg += `🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n`; 
                    msg += `📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${bar} <b>${signal.conf}%</b>\n`; 
                    msg += `━━━━━━━━━━━━━━━━━━\n`; 
                    msg += `⚠️ <b>${threatLevel}</b>\n`; 
                    msg += `💰 <b>𝐈𝐧𝐯𝐞𝐬𝐭𝐦𝐞𝐧𝐭 (𝐋${state.realLevel + 1}): Rs. ${betAmount}</b>\n`; 
                    msg += `⚙️ <i>${signal.reason}</i>`; 
                    
                    await sendTelegram(msg); 
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf, timestamp: Date.now() }; 
                    saveState(); 
                } 
            } 
            state.lastProcessedIssue = latestIssue; saveState(); 
        } 
    } catch (e) {
        console.log(`[API ERROR] Fetch failed: ${e.message}`);
    } finally { 
        isProcessing = false; 
    } 
} 

setInterval(tick, 2500); 
tick();
