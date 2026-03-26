import axios from 'axios';

async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};
    
    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const fileId = '1pOFDptzcYxRUnxM_91YeFr7T2fRsQXqO';
        const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const res = await axios.get(url);

        if (!res.data || !Array.isArray(res.data)) return;

        const data = res.data;
        const random = data[Math.floor(Math.random() * data.length)];

        const question = random.question || 'من هو هذا اللاعب؟';
        const image = random.image;
        const answer = random.response.toLowerCase();

        const message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ ❓ *السؤال : ${question}*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : 500 نقطة*
╯───────────────────────╰ـ
        `.trim()
        });

        global.gameActive[m.chat] = {
            answer: answer,
            image: image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة هي : ${ans}*
╯───────────────────────╰ـ
                        `.trim()
                    }, { quoted: m });
                }
            }, 60000)
        };

    } catch (e) {
        console.log(e);
    }
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    if (!global.gameActive) global.gameActive = {};
    
    const game = global.gameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `
╮───────────────────────╭ـ
│ 🎉 *إجابة صحيحة!*
│ 🔥 *كفو عليك جبتها صح*
╯───────────────────────╰ـ

> اكتب *.كوره* عشان تلعب تاني
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة غلط، حاول تاني*");
        return true;
    }
};

handler.help = ['كوره'];
handler.tags = ['game'];
handler.command = /^(كوره)$/i;

export default handler;
