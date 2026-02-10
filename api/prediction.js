export default async function handler(req, res) {

  try {

    const WINGO_API =
      "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?pageNo=1&pageSize=60";

    const TELEGRAM_TOKEN = process.env.TG_TOKEN;
    const MY_CHAT_ID = process.env.TG_CHAT_ID;
    const GROUP_CHAT_ID = process.env.TG_GROUP_ID;

    // 1) Get market data
    const r = await fetch(WINGO_API);
    const j = await r.json();
    const list = j.data.list;

    const completed = list[0].issueNumber;
    const next = (BigInt(completed) + 1n).toString();

    // Simple prediction (works 100% on Vercel)
    const lastColor = list[0].number % 2 === 0 ? "RED" : "GREEN";
    const prediction = lastColor === "RED" ? "GREEN" : "RED";

    const message = `📢 Prediction for ${next}: ${prediction}`;

    // 2) Try Telegram but DO NOT crash if it fails
    if (TELEGRAM_TOKEN) {
      try {
        const { default: TelegramBot } = await import("node-telegram-bot-api");
        const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

        if (MY_CHAT_ID) await bot.sendMessage(MY_CHAT_ID, message);
        if (GROUP_CHAT_ID) await bot.sendMessage(GROUP_CHAT_ID, message);

      } catch (e) {
        console.log("Telegram skipped:", e.message);
      }
    }

    // 3) Always return success
    return res.status(200).json({
      nextIssue: next,
      prediction,
      history: list.slice(0, 10)
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server crashed",
      message: err.message
    });
  }
}
