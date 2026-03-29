async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // حذف اللعبة القديمة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // الأسئلة موجودة مباشرة داخل الكود
        const data = [
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png", name: "Facebook" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", name: "Instagram" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/4/44/WhatsApp_icon.png", name: "WhatsApp" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Twitter_icon.png", name: "Twitter" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Snapchat_logo.svg", name: "Snapchat" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/c/c2/LinkedIn_logo_initials.png", name: "LinkedIn" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/5f/TikTok_logo.svg", name: "TikTok" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/YouTube_social_white_squircle_%282017%29.svg", name: "YouTube" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Google_Logo.svg", name: "Google" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Spotify_logo_with_text.svg", name: "Spotify" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/9/95/Netflix_2015_logo.svg", name: "Netflix" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Telegram_logo.svg", name: "Telegram" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/2/21/Reddit_logo_orange.svg", name: "Reddit" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Dropbox_icon_2017.svg", name: "Dropbox" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Adobe_Creative_Cloud_icon.svg", name: "Adobe" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/PayPal_logo.svg", name: "PayPal" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/59/Zoom_logo.svg", name: "Zoom" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/18/Pinterest-logo.png", name: "Pinterest" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/9/96/Dropbox_logo_2017.svg", name: "Dropbox" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", name: "Apple" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Instagram_logo_2016.svg", name: "Instagram2" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Discord_logo_wordmark.svg", name: "Discord" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Slack_logo.svg", name: "Slack" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Twitch_glitch_logo.svg", name: "Twitch" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Opera_browser_logo_2015.svg", name: "Opera" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Edge_logo_%282019%29.svg", name: "Edge" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Skype_logo.svg", name: "Skype" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Google_Chrome_icon_%282011%29.png", name: "Chrome" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/4/43/Microsoft_Office_logo.svg", name: "Office" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/7/70/Viber_logo.png", name: "Viber" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];
        const image = item.img;
        const answer = item.name.toLowerCase();

        const msg = await conn.sendMessage(m.chat, {
            image: { url: image },
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
            answer,
            image,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    let ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ انتهى الوقت
│ ✅ الإجابة: ${ans}
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حدث خطأ في اللعبة");
    }
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    let game = global.gameActive?.[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    let userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 إجابة صحيحة!
│ 💰 +500 نقطة
╯───────────────────────╰ـ

> اكتب لوجو للعب مرة أخرى
            `.trim()
        });

    } else {
        await m.reply(`
╮───────────────────────╭ـ
│ ❌ إجابة خاطئة
│ 🔁 حاول مرة أخرى
╯───────────────────────╰ـ
        `.trim());
    }

    return true;
};

handler.command = ['لوجو','logo'];
handler.category = 'games';

export default handler;
