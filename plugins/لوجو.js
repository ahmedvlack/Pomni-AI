async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
            { name: "instagram", img: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png" },
            { name: "whatsapp", img: "https://cdn-icons-png.flaticon.com/512/733/733585.png" },
            { name: "youtube", img: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
            { name: "twitter", img: "https://cdn-icons-png.flaticon.com/512/733/733579.png" },
            { name: "tiktok", img: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png" },
            { name: "snapchat", img: "https://cdn-icons-png.flaticon.com/512/733/733576.png" },
            { name: "telegram", img: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png" },
            { name: "linkedin", img: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
            { name: "pinterest", img: "https://cdn-icons-png.flaticon.com/512/733/733558.png" },
            { name: "spotify", img: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
            { name: "netflix", img: "https://cdn-icons-png.flaticon.com/512/5977/5977590.png" },
            { name: "amazon", img: "https://cdn-icons-png.flaticon.com/512/5968/5968784.png" },
            { name: "paypal", img: "https://cdn-icons-png.flaticon.com/512/174/174861.png" },
            { name: "discord", img: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png" },
            { name: "reddit", img: "https://cdn-icons-png.flaticon.com/512/2111/2111589.png" },
            { name: "skype", img: "https://cdn-icons-png.flaticon.com/512/174/174869.png" },
            { name: "viber", img: "https://cdn-icons-png.flaticon.com/512/2111/2111708.png" },
            { name: "slack", img: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png" },
            { name: "zoom", img: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png" },
            { name: "google", img: "https://cdn-icons-png.flaticon.com/512/300/300221.png" },
            { name: "apple", img: "https://cdn-icons-png.flaticon.com/512/0/747.png" },
            { name: "github", img: "https://cdn-icons-png.flaticon.com/512/733/733553.png" },
            { name: "twitch", img: "https://cdn-icons-png.flaticon.com/512/2111/2111668.png" },
            { name: "ebay", img: "https://cdn-icons-png.flaticon.com/512/732/732221.png" },
            { name: "wechat", img: "https://cdn-icons-png.flaticon.com/512/2111/2111728.png" },
            { name: "messenger", img: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
            { name: "quora", img: "https://cdn-icons-png.flaticon.com/512/733/733600.png" },
            { name: "tripadvisor", img: "https://cdn-icons-png.flaticon.com/512/733/733597.png" },
            { name: "uber", img: "https://cdn-icons-png.flaticon.com/512/732/732200.png" }
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

    // 🔥 ذكاء في الإجابة (مش لازم تطابق 100%)
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
