async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // حذف اللعبة القديمة
    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // رابط JSON (مشفر)
        const res = await fetch('https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/%D9%84%D9%88%D8%AC%D9%88.json');
        const data = await res.json();

        if (!Array.isArray(data)) {
            return m.reply("❌ خطأ في ملف الأسئلة");
        }

        const item = data[Math.floor(Math.random() * data.length)];

        if (!item.image || !item.response) {
            return m.reply("❌ سؤال غير صالح");
        }

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.image },
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
            answer: item.response.toLowerCase(),
            image: item.image,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    let ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة:* ${ans}
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ فشل تحميل الأسئلة من الرابط");
    }
}

// التحقق من الإجابة
handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    let game = global.gameActive?.[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    let userAnswer = m.text.toLowerCase().trim();

    // إجابة صحيحة
    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *+500 نقطة*
╯───────────────────────╰ـ

> اكتب *لوجو* عشان تلعب تاني
            `.trim()
        });

    } else {
        await m.reply(`
╮───────────────────────╭ـ
│ ❌ *إجابة خاطئة*
│ 🔁 *حاول مرة أخرى*
╯───────────────────────╰ـ
        `.trim());
    }

    return true;
};

handler.command = ['لوجو','logo'];
handler.category = 'games';

export default handler;
