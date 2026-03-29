async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "instagram", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "whatsapp", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "twitter", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "snapchat", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "linkedin", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "tiktok", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "youtube", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "google", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "spotify", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "amazon", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "paypal", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "netflix", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "airbnb", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "uber", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "discord", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "reddit", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "shazam", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "telegram", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "pinterest", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "twitch", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "skype", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "viber", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "soundcloud", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "snapseed", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "evernote", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "skyscanner", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "tripadvisor", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "zoom", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "quora", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." },
            { name: "slack", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭ـ
│ ❓ ما اسم هذا التطبيق؟
│ ⏳ الوقت: 30 ثانية
│ 💰 الجائزة: 500 نقطة
╯───────────────────────╰ـ
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answer: item.name,
            image: item.img,
            messageId: msg.key.id,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answer;
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, { text: `⏰ انتهى الوقت\n✅ الإجابة: ${ans}` }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply('❌ حدث خطأ في اللعبة');
    }
}

handler.before = async (m) => {
    if (!m.text) return false;
    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    const userAnswer = m.text.toLowerCase().trim();

    if (userAnswer === game.answer) {
        clearTimeout(game.timeout);
        delete global.gameActive[m.chat];
        await m.reply(`🎉 إجابة صحيحة!\n💰 +500 نقطة\n> اكتب *لوجو* للعب مرة أخرى`);
        return true;
    } else if (m.quoted && m.quoted.id === game.messageId) {
        await m.reply('❌ إجابة خاطئة\n🔁 حاول مرة أخرى');
        return true;
    }

    return false;
};

handler.command = ['لوجو','logo'];
handler.category = 'games';

export default handler;
