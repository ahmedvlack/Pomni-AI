async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // حذف أي لعبة سابقة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // بيانات التطبيقات مع روابط صور مباشرة داخل الكود
        const data = [
            { name: "facebook", img: "https://i.postimg.cc/3xT6QZ3P/facebook.jpg" },
            { name: "instagram", img: "https://i.postimg.cc/GtjyWf97/instagram.jpg" },
            { name: "whatsapp", img: "https://i.postimg.cc/t4gZQWxk/whatsapp.jpg" },
            { name: "twitter", img: "https://i.postimg.cc/qqZYXbWx/twitter.jpg" },
            { name: "snapchat", img: "https://i.postimg.cc/C1vp2m73/snapchat.jpg" },
            { name: "linkedin", img: "https://i.postimg.cc/QC1J4S8p/linkedin.jpg" },
            { name: "tiktok", img: "https://i.postimg.cc/t4VY7gWd/tiktok.jpg" },
            { name: "youtube", img: "https://i.postimg.cc/ZqZ2tL8P/youtube.jpg" },
            { name: "google", img: "https://i.postimg.cc/63p3WTYm/google.jpg" },
            { name: "spotify", img: "https://i.postimg.cc/Nf2X6m1t/spotify.jpg" },
            { name: "amazon", img: "https://i.postimg.cc/65mD9k98/amazon.jpg" },
            { name: "paypal", img: "https://i.postimg.cc/1tqd4bGc/paypal.jpg" },
            { name: "netflix", img: "https://i.postimg.cc/7YcSdXxx/netflix.jpg" },
            { name: "airbnb", img: "https://i.postimg.cc/3RLC13CH/airbnb.jpg" },
            { name: "uber", img: "https://i.postimg.cc/26m7H7qY/uber.jpg" },
            { name: "discord", img: "https://i.postimg.cc/SN5G8mXy/discord.jpg" },
            { name: "reddit", img: "https://i.postimg.cc/6pg2P6hp/reddit.jpg" },
            { name: "shazam", img: "https://i.postimg.cc/rmMgJQdV/shazam.jpg" },
            { name: "telegram", img: "https://i.postimg.cc/0jvC9G8f/telegram.jpg" },
            { name: "pinterest", img: "https://i.postimg.cc/j2j9mB0H/pinterest.jpg" },
            { name: "twitch", img: "https://i.postimg.cc/5yK0k0VX/twitch.jpg" },
            { name: "skype", img: "https://i.postimg.cc/zX2dg1Hk/skype.jpg" },
            { name: "viber", img: "https://i.postimg.cc/hGNQbYhC/viber.jpg" },
            { name: "soundcloud", img: "https://i.postimg.cc/3R9gq0s9/soundcloud.jpg" },
            { name: "slack", img: "https://i.postimg.cc/pXV9gMT2/slack.jpg" },
            { name: "zoom", img: "https://i.postimg.cc/V6n12m7M/zoom.jpg" },
            { name: "quora", img: "https://i.postimg.cc/0y7xV8PC/quora.jpg" },
            { name: "messenger", img: "https://i.postimg.cc/qsx23qC2/messenger.jpg" },
            { name: "wechat", img: "https://i.postimg.cc/bN0Wn4Rm/wechat.jpg" },
            { name: "yahoo", img: "https://i.postimg.cc/9QWGqyrj/yahoo.jpg" },
            { name: "tumblr", img: "https://i.postimg.cc/vmVhDRL7/tumblr.jpg" }
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

        // حفظ حالة اللعبة
        global.gameActive[m.chat] = {
            answer: item.name.toLowerCase(),
            image: item.img,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, { text: `⏰ انتهى الوقت\n✅ *الإجابة:* ${ans}` }, { quoted: m });
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

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        await m.reply(`
🎉 *إجابة صحيحة!*  
💰 +500 نقطة

> اكتب *لوجو* للعب مرة أخرى
        `);
        return true;
    } else if (m.quoted && m.quoted.id === game.messageId) {
        await m.reply("❌ *إجابة خاطئة حاول مرة أخرى*");
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
