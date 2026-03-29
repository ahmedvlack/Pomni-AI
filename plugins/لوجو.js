async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            {
                name: "whatsapp",
                img: "https://play-lh.googleusercontent.com/8A9Gd4P9zPp2Y7G2dXlV7Qv4z4v1iZ9X1N8f8Z5G3P5Gk5G3P5G=s512"
            },
            {
                name: "facebook",
                img: "https://play-lh.googleusercontent.com/Zj7v1Q5V7d7YQ5n1Z1X7Z5V1Z1X7Z5V=s512"
            },
            {
                name: "instagram",
                img: "https://play-lh.googleusercontent.com/VRMWdJ6fX5U6d5V5Y7V5Y7V5Y7V=s512"
            },
            {
                name: "youtube",
                img: "https://play-lh.googleusercontent.com/youtube_icon=s512"
            },
            {
                name: "tiktok",
                img: "https://play-lh.googleusercontent.com/tiktok_icon=s512"
            },
            {
                name: "telegram",
                img: "https://play-lh.googleusercontent.com/telegram_icon=s512"
            },
            {
                name: "snapchat",
                img: "https://play-lh.googleusercontent.com/snapchat_icon=s512"
            },
            {
                name: "spotify",
                img: "https://play-lh.googleusercontent.com/spotify_icon=s512"
            },
            {
                name: "netflix",
                img: "https://play-lh.googleusercontent.com/netflix_icon=s512"
            },
            {
                name: "amazon",
                img: "https://play-lh.googleusercontent.com/amazon_icon=s512"
            }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭
│ ❓ *ما اسم هذا التطبيق؟*
│ ⏳ *الوقت:* 30 ثانية
│ 💰 *الجائزة:* 500 نقطة
╯───────────────────────╰
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: item.name,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, {
                        text: `⏰ انتهى الوقت\n✅ *الإجابة:* ${ans}`
                    }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حدث خطأ في اللعبة");
    }
}

handler.before = async (m) => {
    if (!m.text) return false;

    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    const answer = m.text.toLowerCase().trim();

    if (answer.includes(game.answer)) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await m.reply(`
🎉 *إجابة صحيحة!*  
💰 +500 نقطة
        `);
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
