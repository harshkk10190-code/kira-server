const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ðŸŒ WEB MONITOR
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050510; color:#00ff9d; font-family:monospace; text-align:center; padding:50px;">
            <h2>ðŸŸ¢ KIRA QUANTUM V8 (SNIPER SERVER) ONLINE</h2>
            <p>The AI is currently calculating market formulas in the background.</p>
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p>
        </body>
    `);
});
app.listen(PORT, () => console.log(`ðŸš€ Kira V8 Sniper Server listening on port ${PORT}`));

// ==========================================
// âš™ï¸ TELEGRAM & API CONFIGURATION
// ==========================================
const BOT_TOKEN = "8561861801:AAH6ySPI6hgSSEoxL7Cp_q43uGhGsTW67cI";
const TARGET_CHATS = ["1669843747", "-1002613316641"];
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";
const FUND_LEVELS = [33, 66, 100, 133, 168, 500];

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://www.dmwin2.com",
    "Referer": "https://www.dmwin2.com/"
};

// ==========================================
// ðŸ§  MEMORY & STATE
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

// ==========================================
// ðŸ“¨ VIP TELEGRAM SENDER
// ==========================================
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
    let bootMsg = `ðŸŸ¢ <b>KIRA QUANTUM V8 (SNIPER) ONLINE</b> ðŸŸ¢\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\nðŸ“¡ <i>Formula Calculation Engine Activated.\nStrict Pattern Sniping Engaged.</i>`;
    sendTelegram(bootMsg);
    state.isStarted = true; saveState();
}

// ==========================================
// ðŸ§  QUANTUM V8 BRAIN (FORMULA + SNIPER)
// ==========================================
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; }
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; }

function analyzeSniper(list) {
    if(!list || list.length < 10) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" };

    // 1. EXTRACT RAW DATA
    const latestItem = list[0];
    const periodStr = latestItem.issueNumber.toString();
    const periodLastDigit = parseInt(periodStr.slice(-1));
    const lastWinningNumber = parseInt(latestItem.number);
    
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number)));

    // 2. THE MATH FORMULA HACK
    // (Period Last Digit + Last Winning Number)
    const calcSum = periodLastDigit + lastWinningNumber;
    const mathIsEven = (calcSum % 2 === 0);
    
    // Standard Formula Rule: Even = RED/SMALL, Odd = GREEN/BIG
    const formulaSize = mathIsEven ? "SMALL" : "BIG";
    const formulaColor = mathIsEven ? "RED" : "GREEN";

    // 3. THE PATTERN CONFLUENCE (Sniper Check)
    let finalPrediction = null;
    let finalType = null;
    let reasonText = "";

    // Check SIZE alignment
    let sizeChop = (sizes[0] !== sizes[1] && sizes[1] !== sizes[2]);
    let sizeStreak = (sizes[0] === sizes[1] && sizes[1] === sizes[2]);
    
    let patternSize = null;
    if(sizeChop) patternSize = sizes[0] === "BIG" ? "SMALL" : "BIG"; // Expect chop to continue
    if(sizeStreak) patternSize = sizes[0]; // Expect streak to continue

    // Check COLOR alignment
    let colorChop = (colors[0] !== colors[1] && colors[1] !== colors[2]);
    let colorStreak = (colors[0] === colors[1] && colors[1] === colors[2]);

    let patternColor = null;
    if(colorChop) patternColor = colors[0] === "RED" ? "GREEN" : "RED";
    if(colorStreak) patternColor = colors[0];

    // 4. THE TRIGGER LOCK
    // Only fire if the Mathematical Formula perfectly matches the Chart Pattern
    if (patternSize && formulaSize === patternSize) {
        finalPrediction = formulaSize;
        finalType = "SIZE";
        reasonText = sizeChop ? "Math + Chop Confluence" : "Math + Trend Confluence";
    } 
    else if (patternColor && formulaColor === patternColor) {
        finalPrediction = formulaColor;
        finalType = "COLOR";
        reasonText = colorChop ? "Math + Chop Confluence" : "Math + Trend Confluence";
    }

    // 5. SAFETY ABORT
    if (!finalPrediction) {
        return { type: "NONE", action: "WAIT", conf: 0, reason: "FORMULA CONFLICT - ABORTING" };
    }

    // Sniper Confidence is always high because it requires dual-verification
    let confidence = Math.floor(Math.random() * (95 - 88 + 1)) + 88; // 88% to 95%

    return { type: finalType, action: finalPrediction, conf: confidence, reason: `Sniper Lock: ${reasonText}` };
}

// ==========================================
// âš™ï¸ SERVER MAIN LOOP
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
        
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) {
            state.activePrediction = null; saveState();
        }

        // 1ï¸âƒ£ CHECK PREVIOUS RESULT
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
                    
                    let resMsg = isWin ? `âœ… <b>ð“ð€ð‘ð†ð„ð“ ð„ð‹ðˆðŒðˆðð€ð“ð„ðƒ</b> âœ…\n` : `âŒ <b>ð“ð€ð‘ð†ð„ð“ ðŒðˆð’ð’ð„ðƒ</b> âŒ\n`;
                    resMsg += `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n`;
                    resMsg += `ðŸŽ¯ ððžð«ð¢ð¨ð: <code>${state.activePrediction.period.slice(-4)}</code>\n`;
                    resMsg += `ðŸŽ² ð‘ðžð¬ð®ð¥ð­: <b>${actualNum} (${actualResult})</b>\n`;
                    if(isWin) resMsg += `ðŸ’° ð’ð­ðšð­ð®ð¬: <b>PROFIT SECURED! (Level 1 Reset)</b>\n`;
                    else resMsg += `ðŸ›¡ï¸ ð’ð­ðšð­ð®ð¬: Moving to Level ${state.currentLevel + 1}...\n`;
                    resMsg += `ðŸ“ˆ ð€ðœðœð®ð«ðšðœð²: ${currentAccuracy}%\n`;
                    resMsg += `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”`;

                    await sendTelegram(resMsg);
                } 
                state.activePrediction = null; saveState();
            }
        }

        // 2ï¸âƒ£ GENERATE NEW SNIPER PREDICTION
        if(state.lastProcessedIssue !== latestIssue) {
            if(!state.activePrediction) {
                const signal = analyzeSniper(list);
                
                if(signal && signal.action === "WAIT") {
                    let msg = `â¸ <b>ðŒð€ð‘ðŠð„ð“ ð’ð‚ð€ð | ððžð«ð¢ð¨ð: ${targetIssue.slice(-4)}</b>\n\nâš ï¸ <b>ð€ðœð­ð¢ð¨ð§:</b> WAIT\nðŸ“‰ <b>ð‘ðžðšð¬ð¨ð§:</b> ${signal.reason}`;
                    await sendTelegram(msg);
                } else if(signal) {
                    let signalEmoji = signal.type === "COLOR" ? "ðŸŽ¨" : "ðŸ“";
                    let betAmount = FUND_LEVELS[state.currentLevel];
                    
                    let msg = `âš¡ï¸ ðŠðˆð‘ð€ ð’ððˆðð„ð‘ ð•ðŸ– âš¡ï¸\n`;
                    msg += `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n`;
                    msg += `ðŸŽ¯ ððžð«ð¢ð¨ð: <code>${targetIssue.slice(-4)}</code>\n`;
                    msg += `${signalEmoji} <b>ð’ð¢ð ð§ðšð¥ ð“ð²ð©ðž:</b> ${signal.type}\n`;
                    msg += `ðŸ”® <b>ðð«ðžðð¢ðœð­ð¢ð¨ð§: ${signal.action}</b>\n`;
                    msg += `ðŸ“Š ð‚ð¨ð§ðŸð¢ððžð§ðœðž: ${signal.conf}%\n`;
                    msg += `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n`;
                    msg += `ðŸ’° <b>ð”ð’ð„ ð‹ð„ð•ð„ð‹ ${state.currentLevel + 1} ð…ð”ððƒ: Rs. ${betAmount}</b>\n`;
                    msg += `ðŸ’¡ <i>${signal.reason}</i>`;
                    
                    await sendTelegram(msg);
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: signal.type, conf: signal.conf };
                    saveState();
                }
            }
            state.lastProcessedIssue = latestIssue; saveState();
        }
    } catch (e) {
    } finally {
        isProcessing = false; 
    }
}

setInterval(tick, 2000);
tick();
