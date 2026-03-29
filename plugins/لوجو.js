async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        // قائمة التطبيقات مع صور Base64
        const data = [
            {
                name: "facebook",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." // اختصر Base64 هنا
            },
            {
                name: "instagram",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            },
            {
                name: "whatsapp",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            },
            {
                name: "twitter",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            },
            {
                name: "snapchat",
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        // ارسال السؤال
        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img }, // Base64 مباشرة
            caption: `
╮───────────────────────╭ـ
│ ❓ ما اسم هذا التطبيق؟
│ ⏳ الوقت: 30 ثانية
│ 💰 الجائزة: 500 نقطة
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
        m.reply('❌ حدث خطأ في اللعبة');
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
