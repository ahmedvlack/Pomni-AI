import axios from 'axios';

let timeout = 60000; // 60 ثانية
let poin = 500; // نقاط اللعبة

async function handler(m, { conn }) {
    if (!global.logoGameActive) global.logoGameActive = {};

    const oldGame = global.logoGameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.logoGameActive[m.chat];
    }

    try {
        // الرابط المباشر للملف JSON
        const url = 'https://raw.githubusercontent.com/BlackChatGPTAssets/logos/main/logos.json';
        const res = await axios.get(url);
        const data = res.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const random = data[Math.floor(Math.random() * data.length)];

        const question = random.question;
        const image = random.image;
        const answer = random.response.toLowerCase();

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ ❓ *السؤال : ${question}*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : ${poin} نقطة*
╯───────────────────────╰ـ
            `.trim()
        });

        global.logoGameActive[m.chat] = {
            answer: answer,
            image: image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.logoGameActive[m.chat]) {
                    const ans = global.logoGameActive[m.chat].answer;
                    delete global.logoGameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة هي : ${ans}*
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, timeout)
        };

    } catch (e) {
        console.log(e);
    }
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    if (!global.logoGameActive) global.logoGameActive = {};

    const game = global.logoGameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب من اللعبة*
╯───────────────────────╰ـ
            `.trim()
        });
        return true;
    }

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 💰 *كسبت ${poin} نقطة*
╯───────────────────────╰ـ

> اكتب *لوجو* عشان تلعب تاني
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة غلط حاول تاني*");
        return true;
    }
};

handler.help = ['لوجو'];
handler.tags = ['game'];
handler.command = /^(لوجو)$/i;

export default handler;
