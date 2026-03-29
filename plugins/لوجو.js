import fetch from 'node-fetch';

let timeout = 30000;
let poin = 4999;

async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    // إنهاء أي لعبة سابقة في نفس الشات
    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const res = await fetch('https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json');

        if (!res.ok) throw new Error('Failed to fetch data');

        const text = await res.text();
        const json = JSON.parse(text);

        // دعم أكثر من شكل للبيانات
        const data = Array.isArray(json) ? json : json?.data;

        if (!Array.isArray(data)) {
            throw new Error('Invalid JSON structure');
        }

        const random = data[Math.floor(Math.random() * data.length)];

        const image = random?.data?.image;
        const answer = (random?.data?.jawaban || '').toLowerCase();

        if (!image || !answer) throw new Error('Missing image or answer');

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ ❓ *ما هو اسم هذا الشعار؟*
│ ⏳ *الوقت : 30 ثانية*
│ 💰 *الجائزة : ${poin} XP*
╯───────────────────────╰ـ

> اكتب الإجابة أو: انسحاب
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer,
            image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                const game = global.gameActive[m.chat];
                if (!game) return;

                delete global.gameActive[m.chat];

                conn.sendMessage(m.chat, {
                    text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة هي : ${game.answer}*
╯───────────────────────╰ـ
                    `.trim()
                }, { quoted: m });

            }, timeout)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حدث خطأ أثناء جلب السؤال");
    }
}

handler.before = async (m, { conn }) => {
    if (!m.text) return false;
    if (!global.gameActive) global.gameActive = {};

    const game = global.gameActive[m.chat];
    if (!game) return false;

    const userAnswer = m.text.toLowerCase().trim();

    // انسحاب
    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب من اللعبة*
╯───────────────────────╰ـ
            `.trim()
        });

        return true;
    }

    // إجابة صحيحة
    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *كسبت ${poin} XP*
╯───────────────────────╰ـ

> اكتب .لوجو للعب مرة أخرى
            `.trim()
        });

        return true;
    }

    // إجابة خاطئة
    return m.reply("❌ *إجابة خاطئة حاول مرة أخرى*");
};

handler.help = ['لوجو'];
handler.tags = ['game'];
handler.command = /^(لوجو)$/i;

export default handler;
