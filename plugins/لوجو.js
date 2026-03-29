import fs from "fs";

let timeout = 30000;
let poin = 500;

let handler = async (m, { conn }) => {

    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {};

    let id = m.chat;

    // منع تعدد الأسئلة في نفس الشات
    if (id in conn.tebaklogo) {
        return conn.reply(m.chat, "❌ يوجد سؤال بالفعل لم يتم الإجابة عليه", m);
    }

    // قراءة ملف JSON
    let logos;
    try {
        logos = JSON.parse(fs.readFileSync("./media/logos.json"));
    } catch (e) {
        console.log(e);
        return m.reply("❌ لا يمكن قراءة ملف logos.json");
    }

    // اختيار عنصر عشوائي
    let item = logos[Math.floor(Math.random() * logos.length)];

    // تحويل Base64 إلى Buffer
    let buffer = Buffer.from(item.img.split(',')[1], 'base64');

    // إرسال الصورة
    let msg = await conn.sendMessage(m.chat, {
        image: buffer,
        caption: `
╮───────────────────────╭
│ ❓ *ما اسم هذا التطبيق؟*
│ ⏳ لديك 30 ثانية
│ 💰 الجائزة: ${poin} نقطة
╯───────────────────────╰
        `.trim()
    }, { quoted: m });

    // حفظ الحالة
    conn.tebaklogo[id] = {
        answer: item.name.toLowerCase(),
        timeout: setTimeout(() => {
            if (conn.tebaklogo[id]) {
                conn.reply(m.chat, `⏰ انتهى الوقت\n✅ الإجابة: ${conn.tebaklogo[id].answer}`, m);
                delete conn.tebaklogo[id];
            }
        }, timeout)
    };
};

handler.before = async function (m) {
    let id = m.chat;
    if (!conn.tebaklogo || !(id in conn.tebaklogo)) return;

    let game = conn.tebaklogo[id];
    if (!m.text) return;

    let userAnswer = m.text.toLowerCase().trim();

    if (userAnswer.includes(game.answer)) {
        clearTimeout(game.timeout);
        delete conn.tebaklogo[id];

        await m.reply(`🎉 إجابة صحيحة! +${poin} نقطة`);
    }
};

handler.help = ["logo"];
handler.command = ["لوجو", "logo"];
handler.tags = ["game"];

export default handler;
