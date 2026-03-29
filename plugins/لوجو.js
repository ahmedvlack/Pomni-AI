async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://i.postimg.cc/4NdgpQq2/facebook.jpg" },
            { name: "instagram", img: "https://i.postimg.cc/8c7v1s1Q/instagram.jpg" },
            { name: "whatsapp", img: "https://i.postimg.cc/Zn4g8Fvq/whatsapp.jpg" },
            { name: "twitter", img: "https://i.postimg.cc/VskZk4Lc/twitter.jpg" },
            { name: "snapchat", img: "https://i.postimg.cc/2yN2svkd/snapchat.jpg" },
            { name: "linkedin", img: "https://i.postimg.cc/HkGfqT3W/linkedin.jpg" },
            { name: "tiktok", img: "https://i.postimg.cc/0QLqPvSd/tiktok.jpg" },
            { name: "youtube", img: "https://i.postimg.cc/SRmJgVxJ/youtube.jpg" },
            { name: "google", img: "https://i.postimg.cc/Gpq5z4m9/google.jpg" },
            { name: "spotify", img: "https://i.postimg.cc/9fpyh4Mn/spotify.jpg" },
            { name: "amazon", img: "https://i.postimg.cc/x8nNjfRr/amazon.jpg" },
            { name: "paypal", img: "https://i.postimg.cc/pV6Wn0Mh/paypal.jpg" },
            { name: "netflix", img: "https://i.postimg.cc/wx9QvMrG/netflix.jpg" },
            { name: "airbnb", img: "https://i.postimg.cc/zfL5hF8r/airbnb.jpg" },
            { name: "uber", img: "https://i.postimg.cc/bwvbQfQ9/uber.jpg" },
            { name: "discord", img: "https://i.postimg.cc/5yhP0vND/discord.jpg" },
            { name: "reddit", img: "https://i.postimg.cc/Kv7q9xWg/reddit.jpg" },
            { name: "shazam", img: "https://i.postimg.cc/4x0QrxBB/shazam.jpg" },
            { name: "telegram", img: "https://i.postimg.cc/3xYgG3sF/telegram.jpg" },
            { name: "pinterest", img: "https://i.postimg.cc/pLYtJT6S/pinterest.jpg" },
            { name: "twitch", img: "https://i.postimg.cc/RCW647M8/twitch.jpg" },
            { name: "skype", img: "https://i.postimg.cc/kGB6t6BD/skype.jpg" },
            { name: "viber", img: "https://i.postimg.cc/1RDmS9Q4/viber.jpg" },
            { name: "soundcloud", img: "https://i.postimg.cc/43D1zD5S/soundcloud.jpg" },
            { name: "snapseed", img: "https://i.postimg.cc/9f4fMyWX/snapseed.jpg" },
            { name: "evernote", img: "https://i.postimg.cc/SRRV1qZP/evernote.jpg" },
            { name: "skyscanner", img: "https://i.postimg.cc/4N9C2RkM/skyscanner.jpg" },
            { name: "tripadvisor", img: "https://i.postimg.cc/05xFFdxD/tripadvisor.jpg" },
            { name: "zoom", img: "https://i.postimg.cc/3R5YQyZq/zoom.jpg" },
            { name: "slack", img: "https://i.postimg.cc/Vv8BqBf5/slack.jpg" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭ـ
│ ❓ *ما اسم هذا التطبيق؟*
│ ⏳ *الوقت:* 30 ثانية
│ 💰 *الجائزة:* 500 نقطة
╯───────────────────────╰ـ
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: item.name.toLowerCase(),
            image: item.img,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, { text: `⏰ انتهى الوقت\n✅ الإجابة: ${ans}` }, { quoted: m });
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
        await m.reply(`🎉 إجابة صحيحة!\n💰 +500 نقطة\n> اكتب *لوجو* للعب مرة أخرى`);
        return true;
    } else if (m.quoted && m.quoted.id === game.messageId) {
        await m.reply("❌ إجابة خاطئة\n🔁 حاول مرة أخرى");
        return true;
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
