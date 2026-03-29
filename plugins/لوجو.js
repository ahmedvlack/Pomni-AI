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
        // هنا نستبدل الرابط بمصادر اللوجوهات (يمكنك تعديلها حسب الحاجة)
        const logos = [
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png", response: "فيسبوك" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", response: "واتساب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png", response: "يوتيوب" },
            { question: "ما اسم هذا التطبيق؟", image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Snapchat_logo.svg", response: "سناب شات" }
        ];

        const random = logos[Math.floor(Math.random() * logos.length)];

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

// التحقق من الإجابة
handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;

    if (!global.logoGameActive) global.logoGameActive = {};

    const game = global.logoGameActive[m.chat];
    if (!game) return false;

    if (m.quoted.id !== game.messageId) return false;

    const userAnswer = m.text.toLowerCase().trim();

    // انسحاب
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

    // إجابة صحيحة
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
