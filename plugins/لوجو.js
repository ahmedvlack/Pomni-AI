async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
            { name: "instagram", img: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
            { name: "whatsapp", img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
            { name: "twitter", img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Twitter_Logo_2012.svg" },
            { name: "telegram", img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" },
            { name: "youtube", img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
            { name: "linkedin", img: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.svg" },
            { name: "tiktok", img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg" },
            { name: "snapchat", img: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg" },
            { name: "reddit", img: "https://upload.wikimedia.org/wikipedia/en/5/58/Reddit_logo_new.svg" },
            { name: "pinterest", img: "https://upload.wikimedia.org/wikipedia/commons/3/35/Pinterest_logo.svg" },
            { name: "discord", img: "https://upload.wikimedia.org/wikipedia/commons/8/88/Discord_logo.svg" },
            { name: "skype", img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Skype_icon_%282021%29.svg" },
            { name: "viber", img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Viber_logo.svg" },
            { name: "soundcloud", img: "https://upload.wikimedia.org/wikipedia/commons/2/20/SoundCloud_logo.svg" },
            { name: "slack", img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.svg" },
            { name: "zoom", img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Zoom_Communications_Logo.svg" },
            { name: "spotify", img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
            { name: "netflix", img: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
            { name: "apple", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
            { name: "google", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
            { name: "messenger", img: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Facebook_Messenger_logo_2019.svg" },
            { name: "wechat", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/WeChat_Logo.svg" },
            { name: "yahoo", img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Yahoo%21_logotype.svg" },
            { name: "tumblr", img: "https://upload.wikimedia.org/wikipedia/commons/5/58/Tumblr_wordmark.svg" },
            { name: "messenger2", img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Facebook_Messenger_logo_2020.svg" },
            { name: "threads", img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Threads_app_icon.svg" },
            { name: "quora", img: "https://upload.wikimedia.org/wikipedia/commons/3/32/Quora_logo_2015.svg" },
            { name: "tripadvisor", img: "https://upload.wikimedia.org/wikipedia/commons/0/07/Tripadvisor_logo.svg" }
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
