import fetch from "node-fetch";

let timeout = 60000;
let poin = 4999;

async function handler(m, { conn, command }) {
    if (!global.gameActive) global.gameActive = {};

    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }

    try {
        let res = await fetch("https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json");
        let src = await res.json();

        let random = src[Math.floor(Math.random() * src.length)];

        let image = random.data.image;
        let answer = random.data.jawaban.toLowerCase();

        let message = await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: `
╮───────────────────────╭ـ
│ 🧠 *${command.toUpperCase()}*
│ ❓ *ما هو اسم هذا الشعار؟*
│ ⏳ *الوقت : 60 ثانية*
│ 💰 *الجائزة : ${poin} XP*
╯───────────────────────╰ـ
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: answer,
            image: image,
            messageId: message?.key?.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    let ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `
╮───────────────────────╭ـ
│ ⏰ *انتهى الوقت*
│ ✅ *الإجابة : ${ans}*
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

    if (!global.gameActive) global.gameActive = {};

    const game = global.gameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    let userAnswer = m.text.toLowerCase().trim();

    // انسحاب
    if (userAnswer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];

        await conn.sendMessage(m.chat, {
            text: `
╮───────────────────────╭ـ
│ 🚪 *تم الانسحاب*
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

> اكتب *.لوجو* عشان تلعب تاني
            `.trim()
        });

        return true;
    } else {
        await m.reply("❌ *إجابة غلط حاول تاني*");
        return true;
    }
};

handler.help = ["لوجو"];
handler.tags = ["game"];
handler.command = /^tebaklogo|لوجو/i;

export default handler;
