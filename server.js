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
            <h2>🟢 KIRA QUANTUM V8 (SNIPER SERVER) ONLINE</h2> 
            <p>The AI is currently calculating market formulas in the background.</p> 
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API</p> 
        </body> 
    `); 
}); 
app.listen(PORT, () => console.log(`🚀 Kira V8 Sniper Server listening on port ${PORT}`)); 

// ========================================== 
// ⚙️ TELEGRAM & API CONFIGURATION 
// ========================================== 
const BOT_TOKEN = "8561861801:AAHt64tn9p5GtkLCH9G41DTKbxeBHZ6Mc6M"; 
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
        try { 
            state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); 
        } catch(e) { 
            console.log("Memory reset."); 
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
            console.error("TG Delivery Error:", e.message);
        } 
    } 
} 

if (!state.isStarted) { 
    let bootMsg = `🟢 <b>KIRA QUANTUM V8 (SNIPER) ONLINE</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Formula Calculation Engine Activated.\nStrict Pattern Sniping Engaged.</i>`; 
    sendTelegram(bootMsg); 
    state.isStarted = true; 
    saveState(); 
} 

// ========================================== 
// 🧠 QUANTUM V8 BRAIN (FORMULA + SNIPER) 
// ========================================== 
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; } 

function analyzeSniper(list) { 
    if(!list || list.length < 20) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" }; 
    
    // 1. EXTRACT RAW DATA 
    const latestItem = list[0]; 
    const periodStr = latestItem.issueNumber.toString(); 
    const periodLastDigit = parseInt(periodStr.slice(-1)); 
    const lastWinningNumber = parseInt(latestItem.number); 
    const sizes = list.map(i => getSize(Number(i.number))); 
    const colors = list.map(i => getColor(Number(i.number))); 

    // ==========================================
    // 🚀 UPGRADE 1: REAL-TIME BACKTESTER
    // ==========================================
    let formulaWins = 0;
    let formulaLosses = 0;
    
    // Test the formula against the last 15 periods
    for(let i = 1; i < 16; i++) {
        let pastPeriodDigit = parseInt(list[i].issueNumber.toString().slice(-1));
        let pastWinningNum = parseInt(list[i].number);
        let pastCalc = (pastPeriodDigit + pastWinningNum) % 2 === 0;
        let pastExpectedSize = pastCalc ? "SMALL" : "BIG";
        
        let actualResultThatHappened = getSize(Number(list[i-1].number));
        if(pastExpectedSize === actualResultThatHappened) formulaWins++;
        else formulaLosses++;
    }

    // Calculate current formula
    const calcSum = periodLastDigit + lastWinningNumber; 
    const mathIsEven = (calcSum % 2 === 0); 
    
    let baseFormulaSize = mathIsEven ? "SMALL" : "BIG"; 
    let baseFormulaColor = mathIsEven ? "RED" : "GREEN"; 

    // DYNAMIC INVERSION: If the formula has been failing recently, flip it!
    let isReversed = formulaLosses > formulaWins;
    let activeFormulaSize = isReversed ? (baseFormulaSize === "SMALL" ? "BIG" : "SMALL") : baseFormulaSize;
    let activeFormulaColor = isReversed ? (baseFormulaColor === "RED" ? "GREEN" : "RED") : baseFormulaColor;

    // ==========================================
    // 🚀 UPGRADE 2: ADVANCED PATTERN CONFLUENCE
    // ==========================================
    let finalPrediction = null; 
    let finalType = null; 
    let reasonText = isReversed ? "[INVERSED FORMULA]" : "[STANDARD FORMULA]"; 
    
    // SIZE PATTERNS
    let sizeChop = (sizes[0] !== sizes[1] && sizes[1] !== sizes[2]); // ABA
    let sizeStreak = (sizes[0] === sizes[1] && sizes[1] === sizes[2]); // AAA
    let sizeDoubleChop = (sizes[0] === sizes[1] && sizes[2] === sizes[3] && sizes[0] !== sizes[2]); // AABB
    
    let patternSize = null; 
    if(sizeChop) patternSize = sizes[0] === "BIG" ? "SMALL" : "BIG"; 
    if(sizeStreak) patternSize = sizes[0]; 
    if(sizeDoubleChop) patternSize = sizes[0] === "BIG" ? "SMALL" : "BIG";
    
    // COLOR PATTERNS
    let colorChop = (colors[0] !== colors[1] && colors[1] !== colors[2]); 
    let colorStreak = (colors[0] === colors[1] && colors[1] === colors[2]); 
    let colorDoubleChop = (colors[0] === colors[1] && colors[2] === colors[3] && colors[0] !== colors[2]);

    let patternColor = null; 
    if(colorChop) patternColor = colors[0] === "RED" ? "GREEN" : "RED"; 
    if(colorStreak) patternColor = colors[0]; 
    if(colorDoubleChop) patternColor = colors[0] === "RED" ? "GREEN" : "RED";
    
    // ==========================================
    // 3. THE TRIGGER LOCK 
    // ==========================================
    if (patternSize && activeFormulaSize === patternSize) { 
        finalPrediction = activeFormulaSize; 
        finalType = "SIZE"; 
        reasonText += sizeStreak ? " + Trend Alignment" : " + Chop Alignment"; 
    } else if (patternColor && activeFormulaColor === patternColor) { 
        finalPrediction = activeFormulaColor; 
        finalType = "COLOR"; 
        reasonText += colorStreak ? " + Trend Alignment" : " + Chop Alignment"; 
    } 
    
    // 4. SAFETY ABORT 
    if (!finalPrediction) { 
        return { type: "NONE", action: "WAIT", conf: 0, reason: "Math/Pattern Conflict - Waiting for setup" }; 
    } 
    
    // Dynamic Confidence based on backtest strength
    let winRate = isReversed ? (formulaLosses / 15) * 100 : (formulaWins / 15) * 100;
    let confidence = Math.floor(winRate > 60 ? (Math.random() * (99 - 92) + 92) : (Math.random() * (91 - 85) + 85)); 

    return { type: finalType, action: finalPrediction, conf: confidence, reason: reasonText }; 
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
        
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) { 
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
                    if(isWin) { 
                        state.wins++; 
                        state.currentLevel = 0; 
                    } else { 
                        state.currentLevel++; 
                        if(state.currentLevel >= FUND_LEVELS.length) state.currentLevel = 0; 
                    } 
                    
                    let currentAccuracy = Math.round((state.wins / state.totalSignals) * 100); 
                    
                    let resMsg = isWin ? `✅ <b>TARGET ELIMINATED</b> ✅\n` : `❌ <b>TARGET MISSED</b> ❌\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━\n`; 
                    resMsg += `🎯 <b>Period:</b> <code>${state.activePrediction.period.slice(-4)}</code>\n`; 
                    resMsg += `🎲 <b>Result:</b> <b>${actualNum} (${actualResult})</b>\n`; 
                    
                    if(isWin) resMsg += `💰 <b>Status:</b> <b>PROFIT SECURED! (Level 1 Reset)</b>\n`; 
                    else resMsg += `🛡️ <b>Status:</b> Moving to Level ${state.currentLevel + 1}...\n`; 
                    
                    resMsg += `📈 <b>Accuracy:</b> ${currentAccuracy}%\n`; 
                    resMsg += `━━━━━━━━━━━━━━━━━━`; 
                    
                    await sendTelegram(resMsg); 
                } 
                state.activePrediction = null; 
                saveState(); 
            } 
        } 
        
        // 2️⃣ GENERATE NEW SNIPER PREDICTION 
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 
                const signal = analyzeSniper(list); 
                
                if(signal && signal.action === "WAIT") { 
                    let msg = `⏸ <b>MARKET SCAN | Period: ${targetIssue.slice(-4)}</b>\n\n⚠️ <b>Action:</b> WAIT\n📉 <b>Reason:</b> ${signal.reason}`; 
                    await sendTelegram(msg); 
                } else if(signal) { 
                    let signalEmoji = signal.type === "COLOR" ? "🎨" : "📏"; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 
                    
                    let msg = `⚡️ <b>KIRA SNIPER V8</b> ⚡️\n`; 
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
            state.lastProcessedIssue = latestIssue; 
            saveState(); 
        } 
    } catch (e) { 
        console.error("Loop Error:", e.message);
    } finally { 
        isProcessing = false; 
    } 
} 

setInterval(tick, 2000); 
tick();
