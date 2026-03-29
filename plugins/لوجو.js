async function handler(m, { conn }) {
    if (!global.gameActive) {
        global.gameActive = {};
    }
    
    const oldGame = global.gameActive[m.chat];
    if (oldGame) {
        clearTimeout(oldGame.timeout);
        delete global.gameActive[m.chat];
    }
    
    // رابط اللوجوهات
    const data = await (await fetch("https://raw.githubusercontent.com/zyad5yasser/bot-test/master/src/game/لوجو.json")).json();
    
    const item = data[Math.floor(Math.random() * data.length)];
    
    const message = await conn.sendMessage(m.chat, {
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
        messageId: message?.key?.id,
        timeout: setTimeout(() => {
            if (global.gameActive[m.chat]) {
                const ans = global.gameActive[m.chat].answer;
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
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return false;
    
    if (!global.gameActive) {
        global.gameActive = {};
    }
    
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
│ 💰 *+500 نقطة*
│ 🚀 *أحسنت!*
╯───────────────────────╰ـ

> اكتب *لوجو* عشان تلعب تاني
            `.trim()
        });
        return true;
        
    } else {
        await m.reply(`
╮───────────────────────╭ـ
│ ❌ *إجابة خاطئة*
│ 🔁 *حاول مرة أخرى*
╯───────────────────────╰ـ
        `.trim());
        return true;
    }
};

handler.usage = ["لوجو"];
handler.category = "games";
handler.command = ['لوجو','logo'];

export default handler;
