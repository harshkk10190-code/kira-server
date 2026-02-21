const express = require('express');
const fs = require('fs');
const brain = require('brain.js');
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🌐 WEB MONITOR (Keeps Render Awake via UptimeRobot)
// ==========================================
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050510; color:#00ff9d; font-family:monospace; text-align:center; padding:50px;">
            <h2>🟢 KIRA QUANTUM V8 (DUAL-ENGINE) IS ONLINE</h2>
            <p>Running Parallel LSTM + Markov Chains for Color & Size.</p>
            <p style="color:#aaa; font-size:12px;">Monitoring: WinGo 1-Minute API | Uptime Link Active</p>
        </body>
    `);
});
app.listen(PORT, () => console.log(`🚀 Kira Dual-Engine Server listening on port ${PORT}`));

// ==========================================
// ⚙️ TELEGRAM & API CONFIGURATION
// ==========================================
const BOT_TOKEN = "8561861801:AAE8stFdYnAYuiXURg5esS-caURtIzx6gRg";
const TARGET_CHATS = ["1669843747", "-1002613316641"];
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://www.dmwin2.com",
    "Referer": "https://www.dmwin2.com/"
};

// ==========================================
// 🧠 MEMORY & STATE (Ephemeral File System)
// ==========================================
const STATE_FILE = './kira_state.json';
let state = {
    lastProcessedIssue: null,
    activePrediction: null, 
    totalSignals: 0,
    wins: 0,
    isStarted: false,
    bankroll: 1000 
};

function loadState() {
    if (fs.existsSync(STATE_FILE)) {
        try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } 
        catch(e) { console.log("Memory file corrupted. Booting fresh."); }
    }
}
function saveState() { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); }
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
        } catch(e) { console.error(`TG Delivery Error:`, e.message); }
    }
}

if (!state.isStarted) {
    sendTelegram(`🟢 <b>KIRA QUANTUM V8 DUAL-ENGINE ONLINE</b> 🟢\n━━━━━━━━━━━━━━━━━━\n📡 <i>Scanning both COLOR and SIZE metrics simultaneously.</i>\n💰 <b>Starting Bankroll:</b> Rs. ${state.bankroll}`);
    state.isStarted = true; saveState();
}

// ==========================================
// 🧠 QUANTUM V8 BRAIN (DUAL LSTM + MARKOV)
// ==========================================
function getColor(n) { return [0,2,4,6,8].includes(n) ? "RED" : "GREEN"; }
function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; }

class MarkovChain {
    constructor(order = 3) {
        this.order = order;
        this.transitions = {};
    }
    train(data) {
        this.transitions = {};
        for (let i = 0; i <= data.length - this.order - 1; i++) {
            let state = data.slice(i, i + this.order).join(',');
            let nextState = data[i + this.order];
            if (!this.transitions[state]) this.transitions[state] = {};
            if (!this.transitions[state][nextState]) this.transitions[state][nextState] = 0;
            this.transitions[state][nextState]++;
        }
    }
    predict(currentStateArray) {
        let sequence = currentStateArray.slice(-this.order).join(',');
        let possibleTransitions = this.transitions[sequence];
        if (!possibleTransitions) return { action: "WAIT", conf: 0 };
        
        let total = Object.values(possibleTransitions).reduce((a, b) => a + b, 0);
        let bestOutcome = Object.keys(possibleTransitions).reduce((a, b) => possibleTransitions[a] > possibleTransitions[b] ? a : b);
        let prob = (possibleTransitions[bestOutcome] / total) * 100;
        return { action: bestOutcome, conf: Math.round(prob) };
    }
}

// Initialize two completely separate Neural Networks
const netColor = new brain.recurrent.LSTMTimeStep({ inputSize: 1, hiddenLayers: [10, 10], outputSize: 1 });
const netSize = new brain.recurrent.LSTMTimeStep({ inputSize: 1, hiddenLayers: [10, 10], outputSize: 1 });

function analyzeSequence(list, type) {
    let markov = new MarkovChain(3);
    
    if (type === "COLOR") {
        const colors = list.map(i => getColor(Number(i.number))).reverse();
        markov.train(colors);
        const trainingData = list.map(h => getColor(Number(h.number)) === 'RED' ? 0 : 1).reverse();
        netColor.train([trainingData.slice(-20)], { iterations: 100, log: false });
        
        let markovPred = markov.predict(colors);
        const recentData = list.slice(0, 5).map(h => getColor(Number(h.number)) === 'RED' ? 0 : 1).reverse();
        const output = netColor.run(recentData);
        let lstmAction = output < 0.5 ? "RED" : "GREEN";
        let lstmConf = output < 0.5 ? (1 - output) * 100 : output * 100;

        if (markovPred.action === lstmAction && markovPred.conf > 55 && lstmConf > 55) {
            return { action: markovPred.action, conf: Math.round((markovPred.conf + lstmConf) / 2) };
        }
    } else if (type === "SIZE") {
        const sizes = list.map(i => getSize(Number(i.number))).reverse();
        markov.train(sizes);
        const trainingData = list.map(h => getSize(Number(h.number)) === 'SMALL' ? 0 : 1).reverse();
        netSize.train([trainingData.slice(-20)], { iterations: 100, log: false });
        
        let markovPred = markov.predict(sizes);
        const recentData = list.slice(0, 5).map(h => getSize(Number(h.number)) === 'SMALL' ? 0 : 1).reverse();
        const output = netSize.run(recentData);
        let lstmAction = output < 0.5 ? "SMALL" : "BIG";
        let lstmConf = output < 0.5 ? (1 - output) * 100 : output * 100;

        if (markovPred.action === lstmAction && markovPred.conf > 55 && lstmConf > 55) {
            return { action: markovPred.action, conf: Math.round((markovPred.conf + lstmConf) / 2) };
        }
    }
    return { action: "WAIT", conf: 0 };
}

function getMasterPrediction(list) {
    if(!list || list.length < 20) return { type: "NONE", action: "WAIT", conf: 0, reason: "GATHERING DATA" };
    
    // Analyze both concurrently
    let colorSignal = analyzeSequence(list, "COLOR");
    let sizeSignal = analyzeSequence(list, "SIZE");

    // If both fail the confidence check, skip the period
    if (colorSignal.action === "WAIT" && sizeSignal.action === "WAIT") {
        return { type: "NONE", action: "WAIT", conf: 0, reason: "NO CLEAR STATISTICAL EDGE" };
    }

    // Compare and return the stronger signal
    if (colorSignal.conf >= sizeSignal.conf) {
        return { type: "COLOR", action: colorSignal.action, conf: colorSignal.conf, reason: "Color Metrics Dominant" };
    } else {
        return { type: "SIZE", action: sizeSignal.action, conf: sizeSignal.conf, reason: "Size Metrics Dominant" };
    }
}

// ==========================================
// 💰 DYNAMIC RISK MANAGER (Kelly Criterion)
// ==========================================
const PAYOUT_MULTIPLIER = 1.96; 

function calculateKellyBet(confidencePercent, bankroll) {
    let p = confidencePercent / 100; 
    let q = 1 - p;
    let b = PAYOUT_MULTIPLIER - 1; 

    let kellyFraction = ((b * p) - q) / b;
    let safeFraction = Math.min(Math.max(kellyFraction, 0), 0.05); 
    
    let betAmount = Math.max(Math.round(bankroll * safeFraction), 10);
    return kellyFraction <= 0 ? 0 : betAmount; 
}

// ==========================================
// ⚙️ SERVER MAIN LOOP
// ==========================================
let isProcessing = false; 

async function tick() {
    if(isProcessing) return; 
    isProcessing = true;

    try {
        const res = await fetch(API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 5000 });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        const data = await res.json();
        if(!data.data || !data.data.list) throw new Error("Invalid API Response");
        
        const list = data.data.list;
        const latestIssue = list[0].issueNumber;
        const targetIssue = (BigInt(latestIssue) + 1n).toString();

        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) {
            console.log(`⚠️ MISSED RESULT for Period ${state.activePrediction.period}. Forcing reset.`);
            state.activePrediction = null; saveState();
        }

        // 1️⃣ CHECK PREVIOUS RESULT (Now supports BOTH Size & Color logic dynamically)
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period)) {
            const resultItem = list.find(i => i.issueNumber === state.activePrediction.period);
            
            if(resultItem) {
                let actualNum = Number(resultItem.number);
                
                // Dynamically check the result based on what type of prediction was made
                let actualResult = state.activePrediction.type === "COLOR" ? getColor(actualNum) : getSize(actualNum);
                let isWin = (actualResult === state.activePrediction.pred);
                
                state.totalSignals++;
                if(isWin) {
                    state.wins++;
                    state.bankroll += Math.round(state.activePrediction.bet * (PAYOUT_MULTIPLIER - 1));
                } else {
                    state.bankroll -= state.activePrediction.bet;
                }
                
                let currentAccuracy = Math.round((state.wins / state.totalSignals) * 100);
                let emoji = state.activePrediction.type === "COLOR" ? "🎨" : "📏";
                
                let resMsg = isWin ? `✅ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐄𝐋𝐈𝐌𝐈𝐍𝐀𝐓𝐄𝐃</b> ✅\n` : `❌ <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐌𝐈𝐒𝐒𝐄𝐃</b> ❌\n`;
                resMsg += `━━━━━━━━━━━━━━━━━━\n`;
                resMsg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${state.activePrediction.period.slice(-4)}</code>\n`;
                resMsg += `${emoji} <b>𝐓𝐲𝐩𝐞:</b> ${state.activePrediction.type}\n`;
                resMsg += `🎲 𝐑𝐞𝐬𝐮𝐥𝐭: <b>${actualNum} (${actualResult})</b>\n`;
                resMsg += `💰 <b>𝐍𝐞𝐰 𝐁𝐚𝐧𝐤𝐫𝐨𝐥𝐥:</b> Rs. ${state.bankroll}\n`;
                resMsg += `📈 𝐀𝐜𝐜𝐮𝐫𝐚𝐜𝐲: ${currentAccuracy}%\n`;
                resMsg += `━━━━━━━━━━━━━━━━━━`;

                await sendTelegram(resMsg);
                console.log(`[${state.activePrediction.period.slice(-4)}] Result: ${isWin ? 'WIN' : 'LOSS'} | Bankroll: ${state.bankroll}`);
            } 
            state.activePrediction = null; saveState();
        }

        // 2️⃣ PROCESS NEW PERIOD
        if (state.lastProcessedIssue !== latestIssue) {
            if(!state.activePrediction) {
                console.log(`\n[${new Date().toLocaleTimeString()}] 🟢 NEW PERIOD: ${targetIssue.slice(-4)}`);
                
                const signal = getMasterPrediction(list);
                
                if(signal.action !== "WAIT") {
                    let betAmount = calculateKellyBet(signal.conf, state.bankroll);
                    
                    if (betAmount >= 10) {
                        let emoji = signal.type === "COLOR" ? "🎨" : "📏";
                        let msg = `⚡️ 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝟖 ⚡️\n━━━━━━━━━━━━━━━━━━\n🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n${emoji} <b>𝐒𝐢𝐠𝐧𝐚𝐥 𝐓𝐲𝐩𝐞:</b> ${signal.type}\n🔮 <b>𝐏𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧: ${signal.action}</b>\n📊 𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞: ${signal.conf}%\n━━━━━━━━━━━━━━━━━━\n💰 <b>𝐑𝐞𝐜𝐨𝐦𝐦𝐞𝐧𝐝𝐞𝐝 𝐁𝐞𝐭: Rs. ${betAmount}</b>\n💡 <i>${signal.reason}</i>`;
                        
                        await sendTelegram(msg);
                        console.log(`🚀 SIGNAL FIRED: [${signal.type}] ${signal.action} | Bet: ${betAmount}`);
                        
                        state.activePrediction = { period: targetIssue, type: signal.type, pred: signal.action, bet: betAmount };
                        saveState();
                    } else {
                        console.log(`⏸ WAIT: EDGE NEGATIVE. Bet calculated below minimum.`);
                    }
                } else {
                    console.log(`⏸ WAIT: ${signal.reason}`);
                }
            }
            state.lastProcessedIssue = latestIssue; saveState();
        }
    } catch (e) {
        console.error(`⚠️ Engine Error: ${e.message} - Retrying...`);
    } finally {
        isProcessing = false; 
    }
}

setInterval(tick, 3000);
tick();
