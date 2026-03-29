import axios from 'axios';

let TIMEOUT = 60000;
let POINTS = 500;

async function handler(m, { conn }) {
    if (!global.logoGameActive) global.logoGameActive = {};

    if (global.logoGameActive[m.chat]) {
        clearTimeout(global.logoGameActive[m.chat].timeout);
        delete global.logoGameActive[m.chat];
    }

    try {
        const url = 'https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json';
        const res = await axios.get(url);
        const data = res.data;

        if (!Array.isArray(data) || data.length === 0) {
            return conn.reply(m.chat, "❌ ملف الأسئلة فارغ", m);
        }

        const random = data[Math.floor(Math.random() * data.length)];

        const message = await conn.sendMessage(m.chat, {
            image: { url: random.image },
            caption: `
╭─━─━─━─━─━─╮
❓ *السؤال:* ${random.question}
⏳ *الوقت:* 60 ثانية
💰 *الجائزة:* ${POINTS} نقطة
╰─━─━─━─━─━─╯
            `.trim()
        });

        global.logoGameActive[m.chat] = {
            answer: random.response.toLowerCase(),
            image: random.image,
            messageId: message.key.id,
            timeout: setTimeout(() => {
                if (global.logoGameActive[m.chat]) {
                    let ans = global.logoGameActive[m.chat].answer;
                    delete global.logoGameActive[m.chat];

                    conn.sendMessage(m.chat, {
                        text: `⏰ انتهى الوقت!\n✅ الإجابة: ${ans}`
                    }, { quoted: m });
                }
            }, TIMEOUT)
        };

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, "❌ خطأ في تحميل الأسئلة", m);
    }
}

// مهم جدًا 👇
handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    let game = global.logoGameActive[m.chat];
    if (!game || m.quoted.id !== game.messageId) return false;

    let answer = m.text.toLowerCase().trim();

    if (answer === 'انسحاب') {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];
        await m.reply("🚪 تم الانسحاب");
        return true;
    }

    if (answer === game.answer) {
        clearTimeout(game.timeout);
        delete global.logoGameActive[m.chat];

        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `🎉 إجابة صحيحة!\n💰 +${POINTS} نقطة\n> اكتب *لوجو* للعب مرة أخرى`
        });
        return true;
    } else {
        await m.reply("❌ خطأ");
        return true;
    }
};

handler.command = /^(لوجو)$/i;

export default handler;
