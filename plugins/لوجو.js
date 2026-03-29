async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // حذف أي لعبة سابقة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // قائمة التطبيقات مع روابط PNG صالحة على i.ibb.co
        const data = [
            { img: "https://i.ibb.co/F3b5bCw/facebook.png", name: "facebook" },
            { img: "https://i.ibb.co/6N8F1Pm/instagram.png", name: "instagram" },
            { img: "https://i.ibb.co/Yt4tPjr/whatsapp.png", name: "whatsapp" },
            { img: "https://i.ibb.co/0Y3yD4c/twitter.png", name: "twitter" },
            { img: "https://i.ibb.co/3Cc1M3c/snapchat.png", name: "snapchat" },
            { img: "https://i.ibb.co/Fx0GZ9v/linkedin.png", name: "linkedin" },
            { img: "https://i.ibb.co/4ZpHf7c/tiktok.png", name: "tiktok" },
            { img: "https://i.ibb.co/7Q0G7tN/youtube.png", name: "youtube" },
            { img: "https://i.ibb.co/wcYNK7C/google.png", name: "google" },
            { img: "https://i.ibb.co/kMJHgP5/spotify.png", name: "spotify" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        // اختبار إرسال الصورة قبل حفظ اللعبة
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

// التحقق من الإجابة
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
