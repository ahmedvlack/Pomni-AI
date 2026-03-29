async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // حذف أي لعبة سابقة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // بيانات التطبيقات مباشرة داخل الكود
        const data = [
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png", name: "facebook" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", name: "instagram" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/4/44/WhatsApp_icon.png", name: "whatsapp" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Twitter_icon.png", name: "twitter" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Snapchat_logo.svg", name: "snapchat" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/c/c2/LinkedIn_logo_initials.png", name: "linkedin" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/5f/TikTok_logo.svg", name: "tiktok" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/YouTube_social_white_squircle_%282017%29.svg", name: "youtube" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/19/Google_Logo.svg", name: "google" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Spotify_logo_with_text.svg", name: "spotify" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/9/95/Netflix_2015_logo.svg", name: "netflix" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Telegram_logo.svg", name: "telegram" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/2/21/Reddit_logo_orange.svg", name: "reddit" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Dropbox_icon_2017.svg", name: "dropbox" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Adobe_Creative_Cloud_icon.svg", name: "adobe" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/PayPal_logo.svg", name: "paypal" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/5/59/Zoom_logo.svg", name: "zoom" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/1/18/Pinterest-logo.png", name: "pinterest" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Discord_logo_wordmark.svg", name: "discord" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Slack_logo.svg", name: "slack" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Twitch_glitch_logo.svg", name: "twitch" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Opera_browser_logo_2015.svg", name: "opera" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Edge_logo_%282019%29.svg", name: "edge" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Skype_logo.svg", name: "skype" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Google_Chrome_icon_%282011%29.png", name: "chrome" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/4/43/Microsoft_Office_logo.svg", name: "office" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/7/70/Viber_logo.png", name: "viber" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", name: "apple" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Adobe_Photoshop_CC_icon.svg", name: "photoshop" },
            { img: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Zoom_Communications_logo.svg", name: "zoom2" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        // إرسال السؤال
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

        // حفظ اللعبة الحالية
        global.gameActive[m.chat] = {
            answer: item.name,
            image: item.img,
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

// التحقق من الإجابة (سواء مقتبسة أو مباشرة)
handler.before = async (m) => {
    if (!m.text) return false;

    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    let userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await m.reply(`
╮───────────────────────╭ـ
│ 🎉 إجابة صحيحة!
│ 💰 +500 نقطة
╯───────────────────────╰ـ

> اكتب *لوجو* للعب مرة أخرى
        `);
        return true;
    } else if (m.quoted && m.quoted.id === game.messageId) {
        await m.reply(`
╮───────────────────────╭ـ
│ ❌ إجابة خاطئة
│ 🔁 حاول مرة أخرى
╯───────────────────────╰ـ
        `);
        return true;
    }

    return false;
};

handler.command = ['لوجو','logo'];
handler.category = 'games';

export default handler;
