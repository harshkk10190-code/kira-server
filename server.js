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
            <h2>🏛️ 𝐉𝐀𝐑𝐕𝐈𝐒 🤖 𝐈𝐍𝐒𝐓𝐈𝐓𝐔𝐓𝐈𝐎𝐍𝐀𝐋 𝐐𝐔𝐀𝐍𝐓 (𝐕𝟔.𝟎) 🏛️</h2>
            <p>Advanced PDF Trend Engine. Market Health Monitor Active.</p>
        </body>
    `);
});
app.listen(PORT, () => console.log(`🚀 JᴀʀᴠᎥຮ V6.0 Quant Algo listening on port ${PORT}`));

// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = "8561861801:AAFLPCpANEySHKKAa9D_npfErML4qBl-6c0"; 
const TARGET_CHATS = ["1669843747", "-1002613316641"];

const WINGO_API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";
const FUND_LEVELS = [33, 66, 130, 260, 550, 1100]; 

const HEADERS = { 
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36", 
    "Accept": "application/json, text/plain, */*", 
    "Origin": "https://www.dmwin2.com", 
    "Referer": "https://www.dmwin2.com/",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Connection": "keep-alive"
}; 

// ==========================================
// 🧠 MEMORY & STATE
// ==========================================
const STATE_FILE = './jarvis_state.json'; 
let state = { 
    lastProcessedIssue: null, 
    activePrediction: null, 
    totalSignals: 0, 
    wins: 0, 
    isStarted: false, 
    currentLevel: 0,
    waitCount: 0 
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
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { 
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
    let bootMsg = `🏛️ <b>𝐉𝐀𝐑𝐕𝐈𝐒 𝐕𝟔.𝟎 𝐈𝐍𝐒𝐓𝐈𝐓𝐔𝐓𝐈𝐎𝐍𝐀𝐋 𝐎𝐍𝐋𝐈𝐍𝐄</b> 🏛️\n⟡ ════════ ⋆★⋆ ════════ ⟡\n\n🛡️ <i>Market Health Monitor Active.</i>\n📏 <i>Size-Only Quantitative Logic Loaded.</i>\n📈 <i>11/11 Master Trends Calibrated.</i>\n\n⟡ ════════ ⋆★⋆ ════════ ⟡`; 
    sendTelegram(bootMsg); 
} 

// ==========================================
// 📊 MARKET HEALTH MONITOR
// ==========================================
function getMarketHealth() {
    if (state.currentLevel === 0 || state.currentLevel === 1) return "🟢 STABLE";
    if (state.currentLevel === 2 || state.currentLevel === 3) return "🟡 VOLATILE";
    return "🔴 DANGEROUS";
}

// ==========================================
// 📈 SMART 11-PATTERN ALGORITHM (V6.0 DEEP SCAN)
// ==========================================
function analyzeTrendsV7(list) {

    let sizes = list.slice(0, 15).map(i => Number(i.number) <= 4 ? 'S' : 'B');

    let forward = sizes.join('');
    let reverse = sizes.slice().reverse().join('');

    const match = (pattern) =>
        forward.endsWith(pattern) || reverse.endsWith(pattern);

    // ======================
    // REGIME FILTER
    // ======================
    let flips = 0;
    for(let i=0;i<6;i++){
        if(sizes[i] !== sizes[i+1]) flips++;
    }

    if(flips >= 4){
        return { action:"WAIT", reason:"Chop Regime Detected" };
    }

    // ======================
    // GRAVITY CHECK
    // ======================
    let small=0,big=0;
    for(let i=0;i<5;i++){
        let n = Number(list[i].number);
        if(n<=4) small++;
        else big++;
    }
    let gravity = small>big ? 'S' : 'B';

    // ======================
    // 🔷 YOUR PDF PATTERNS (UPGRADED)
    // ======================

    if(match('SSSSBBSSS')) return { action: gravity==='S'?'SMALL':'BIG', reason:'10. Four in Two Trend' };
    if(match('BBBBSSBBB')) return { action: gravity==='B'?'BIG':'SMALL', reason:'10. Four in Two Trend' };

    if(match('BBBBSBBB')) return { action: gravity==='B'?'BIG':'SMALL', reason:'9. Four in One Trend' };
    if(match('SSSSBSSS')) return { action: gravity==='S'?'SMALL':'BIG', reason:'9. Four in One Trend' };

    if(match('SSSBBSS')) return { action: gravity==='S'?'SMALL':'BIG', reason:'8. Three in Two Trend' };
    if(match('BBBSSBB')) return { action: gravity==='B'?'BIG':'SMALL', reason:'8. Three in Two Trend' };

    if(match('BBBBSSS')) return { action: 'SMALL', reason:'5. Quadra Trend' };
    if(match('SSSSBBB')) return { action: 'BIG', reason:'5. Quadra Trend' };

    if(match('SSSBSS')) return { action:'SMALL', reason:'6. Three in One Trend' };
    if(match('BBBSBB')) return { action:'BIG', reason:'6. Three in One Trend' };

    if(match('BBSSBB')) return { action:'SMALL', reason:'2. Double Trend (Extended)' };
    if(match('SSBBSS')) return { action:'BIG', reason:'2. Double Trend (Extended)' };

    if(match('BBSBB')) return { action:'SMALL', reason:'7. Two in One Trend' };
    if(match('SSBSS')) return { action:'BIG', reason:'7. Two in One Trend' };

    if(match('SSSBB')) return { action:'BIG', reason:'3. Triple Trend' };
    if(match('BBBSS')) return { action:'SMALL', reason:'3. Triple Trend' };

    if(match('BBBBB')) return { action:'BIG', reason:'11. Long Trend' };
    if(match('SSSSS')) return { action:'SMALL', reason:'11. Long Trend' };

    if(match('BSBS')) return { action: gravity==='B'?'BIG':'SMALL', reason:'1. Single Trend' };
    if(match('SBSB')) return { action: gravity==='S'?'SMALL':'BIG', reason:'1. Single Trend' };

    if(match('BBSS')) return { action:'BIG', reason:'2. Double Trend' };
    if(match('SSBB')) return { action:'SMALL', reason:'2. Double Trend' };

    return { action:"WAIT", reason:"No Stable PDF Structure" };
}

// ========================================== 
// ⚙️ SERVER MAIN LOOP 
// ========================================== 
let isProcessing = false; 

function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 

async function tick() { 
    if(isProcessing) return; 
    isProcessing = true; 
    
    try { 
        const res = await fetch(WINGO_API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 8000 }); 
        const rawText = await res.text();
        let data;
        
        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            console.log(`\n[FIREWALL BLOCKED] The casino returned a security page instead of JSON.`);
            throw new Error("Casino Firewall Blocked Connection.");
        }

        if(!data.data || !data.data.list) throw new Error("Empty API List"); 
        
        const list = data.data.list; 
        const latestIssue = list[0].issueNumber; 
        const targetIssue = (BigInt(latestIssue) + 1n).toString(); 
        
        if(state.activePrediction && BigInt(latestIssue) >= BigInt(state.activePrediction.period) + 2n) { 
            state.activePrediction = null; saveState(); 
        } 
        
        if(state.activePrediction) { 
            let timeElapsed = Date.now() - state.activePrediction.timestamp;
            if (timeElapsed > 4 * 60 * 1000) { 
                state.activePrediction = null; saveState();
                return;
            }

            if(BigInt(latestIssue) >= BigInt(state.activePrediction.period)) { 
                const resultItem = list.find(i => i.issueNumber === state.activePrediction.period); 
                if(resultItem) { 
                    let actualNum = Number(resultItem.number); 
                    let actualResult = getSize(actualNum); 
                    let isWin = (actualResult === state.activePrediction.pred); 
                    
                    if(isWin) { 
                        state.wins++; 
                        state.totalSignals++; 
                        state.currentLevel = 0; 
                    } else { 
                        state.currentLevel++; 
                        if(state.currentLevel >= FUND_LEVELS.length) {
                            state.totalSignals++; 
                            state.currentLevel = 0; 
                            await sendTelegram(`🛑 <b>𝐌𝐀𝐗 𝐋𝐄𝐕𝐄𝐋 𝐑𝐄𝐀𝐂𝐇𝐄𝐃</b> 🛑\n⚠️ Algorithm detected massive anomaly. Resetting.`);
                        }
                    } 
                    
                    let currentAccuracy = state.totalSignals > 0 ? Math.round((state.wins / state.totalSignals) * 100) : 100; 
                    let marketHealth = getMarketHealth();
                    
                    // 🏛️ V6.0 TERMINAL UI UPDATE
                    let resMsg = isWin ? `✅ <b>𝐏𝐑𝐎𝐅𝐈𝐓 𝐒𝐄𝐂𝐔𝐑𝐄𝐃</b> ✅\n` : `🛑 <b>𝐓𝐀𝐑𝐆𝐄𝐓 𝐌𝐈𝐒𝐒𝐄𝐃</b> 🛑\n`; 
                    resMsg += `⟡ ════════ ⋆★⋆ ════════ ⟡\n`; 
                    resMsg += `🎯 <b>𝐏𝐞𝐫𝐢𝐨𝐝 :</b> <code>${state.activePrediction.period.slice(-4)}</code>\n`; 
                    resMsg += `🎲 <b>𝐑𝐞𝐬𝐮𝐥𝐭 :</b> ${actualNum} (${actualResult})\n`; 
                    resMsg += `📈 <b>𝐌𝐚𝐫𝐤𝐞𝐭 𝐇𝐞𝐚𝐥𝐭𝐡 :</b> ${marketHealth}\n`;
                    
                    if(!isWin) {
                        resMsg += `🛡️ <b>𝐒𝐭𝐚𝐭𝐮𝐬 :</b> 𝐄𝐒𝐂𝐀𝐋𝐀𝐓𝐈𝐍𝐆 (𝐋𝐞𝐯𝐞𝐥 ${state.currentLevel + 1})\n`; 
                    }
                    resMsg += `🏆 <b>𝐖𝐢𝐧 𝐑𝐚𝐭𝐞 :</b> ${currentAccuracy}%\n`;
                    resMsg += `⟡ ════════ ⋆★⋆ ════════ ⟡\n`; 
                    
                    await sendTelegram(resMsg); 
                } 
                state.activePrediction = null; saveState(); 
            } 
        } 
        
        if(state.lastProcessedIssue !== latestIssue) { 
            if(!state.activePrediction) { 

                const signal = analyzeTrendsV7(list);
                let marketHealth = getMarketHealth();
                
                console.log(`\n[${new Date().toLocaleTimeString()}] 🎯 Period ${targetIssue.slice(-4)} | ALGO DECISION:`, signal);
                
                if(signal && signal.action === "WAIT") { 
                    state.waitCount++;
                    if (state.waitCount === 1 || state.waitCount % 15 === 0) {
                        // 🏛️ V6.0 TERMINAL UI UPDATE
                        let msg = `📡 <b>𝐉𝐀𝐑𝐕𝐈𝐒 𝐌𝐀𝐑𝐊𝐄𝐓 𝐒𝐂𝐀𝐍</b> 📡\n`; 
                        msg += `⟡ ═════ ⋆★⋆ ═════ ⟡\n`; 
                        msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`; 
                        msg += `⚠️ <b>𝐀𝐜𝐭𝐢𝐨𝐧:</b> SKIP & WAIT\n`; 
                        msg += `🛡️ <b>𝐀𝐥𝐠𝐨 𝐋𝐨𝐠𝐢𝐜:</b> <i>${signal.reason}</i>\n`;
                        msg += `🔇 <i>(Silencing further scans to prevent spam)</i>`;
                        await sendTelegram(msg); 
                    }
                    saveState();
                } else if(signal && signal.action !== "WAIT") { 
                    state.waitCount = 0; 
                    let betAmount = FUND_LEVELS[state.currentLevel]; 
                    
                    // 🏛️ V6.0 TERMINAL UI UPDATE
                    let msg = `🏛️ <b>𝐉𝐀𝐑𝐕𝐈𝐒 𝐈𝐍𝐒𝐓𝐈𝐓𝐔𝐓𝐈𝐎𝐍𝐀𝐋 : 𝐄𝐗𝐄𝐂𝐔𝐓𝐄</b> 🏛️\n`; 
                    msg += `⟡ ════════ ⋆★⋆ ════════ ⟡\n`; 
                    msg += `🎯 <b>𝐓𝐚𝐫𝐠𝐞𝐭 𝐏𝐞𝐫𝐢𝐨𝐝 :</b> <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `📈 <b>𝐌𝐚𝐫𝐤𝐞𝐭 𝐇𝐞𝐚𝐥𝐭𝐡 :</b> ${marketHealth}\n`;
                    msg += `📊 <b>𝐌𝐞𝐭𝐫𝐢𝐜 :</b> 📏 SIZE ONLY\n`; 
                    msg += `🔮 <b>𝐐𝐮𝐚𝐧𝐭 𝐒𝐢𝐠𝐧𝐚𝐥 : ${signal.action}</b>\n`; 
                    msg += `⟡ ════════ ⋆★⋆ ════════ ⟡\n`; 
                    msg += `💎 <b>𝐄𝐧𝐭𝐫𝐲 𝐋𝐞𝐯𝐞𝐥 :</b> Level ${state.currentLevel + 1}\n`; 
                    msg += `💰 <b>𝐈𝐧𝐯𝐞𝐬𝐭𝐦𝐞𝐧𝐭 :</b> Rs. ${betAmount}\n`; 
                    msg += `🧠 <b>𝐂𝐡𝐚𝐫𝐭 𝐋𝐨𝐠𝐢𝐜 :</b> <i>${signal.reason}</i>`; 
                    
                    await sendTelegram(msg); 
                    state.activePrediction = { period: targetIssue, pred: signal.action, type: "SIZE", conf: 100, timestamp: Date.now() }; 
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
