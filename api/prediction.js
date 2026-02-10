// Use Vercel's built-in fetch
import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TG_TOKEN;
const MY_CHAT_ID = process.env.TG_CHAT_ID;      // your personal chat
const GROUP_CHAT_ID = process.env.TG_GROUP_ID;  // your group chat

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

const WINGO_API =
  "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?pageNo=1&pageSize=60";

function colorOf(n) {
  const num = Number(n);
  if (num === 0) return "violet-red";
  if (num === 5) return "violet-green";
  return num % 2 === 0 ? "red" : "green";
}

function analyze(list) {
  const colors = list.slice(0, 10).map(it => colorOf(it.number));

  // Anti R-G killer
  let alternating = true;
  for (let i = 1; i < 6; i++) {
    if (colors[i] === colors[i - 1]) {
      alternating = false;
      break;
    }
  }
  if (alternating) {
    return colors[0].includes("red") ? "GREEN" : "RED";
  }

  // Break long streak
  let streak = 0;
  for (let i = 0; i < 8; i++) {
    if (colors[i] === colors[0]) streak++;
    else break;
  }
  if (streak >= 3) {
    return colors[0].includes("red") ? "GREEN" : "RED";
  }

  // Majority logic
  let r = 0, g = 0;
  for (let i = 0; i < 7; i++) {
    colors[i].includes("red") ? r++ : g++;
  }
  if (r > g + 1) return "RED";
  if (g > r + 1) return "GREEN";

  return colors[0].includes("red") ? "RED" : "GREEN";
}

export default async function handler(req, res) {
  const r = await fetch(WINGO_API);
  const j = await r.json();
  const list = j.data.list;

  const completed = list[0].issueNumber;
  const next = (BigInt(completed) + 1n).toString();

  const prediction = analyze(list);

  const message = `📢 Prediction for ${next}: ${prediction}`;

  // Send to YOU
  try {
    await bot.sendMessage(MY_CHAT_ID, message);
  } catch (e) {
    console.log("Personal chat error:", e.message);
  }

  // Send to GROUP
  try {
    await bot.sendMessage(GROUP_CHAT_ID, message);
  } catch (e) {
    console.log("Group error:", e.message);
  }

  res.json({
    nextIssue: next,
    prediction,
    history: list.slice(0, 10)
  });
}
