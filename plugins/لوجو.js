async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { name: "facebook", img: "https://i.ibb.co/6tq7wqZ/facebook.jpg" },
            { name: "instagram", img: "https://i.ibb.co/0Y8r4gX/instagram.jpg" },
            { name: "whatsapp", img: "https://i.ibb.co/7bYx5Rf/whatsapp.jpg" },
            { name: "twitter", img: "https://i.ibb.co/LN3X0vB/twitter.jpg" },
            { name: "snapchat", img: "https://i.ibb.co/3NfGd5k/snapchat.jpg" },
            { name: "linkedin", img: "https://i.ibb.co/3f4KcS0/linkedin.jpg" },
            { name: "tiktok", img: "https://i.ibb.co/vd1w0tR/tiktok.jpg" },
            { name: "youtube", img: "https://i.ibb.co/pR5r5yJ/youtube.jpg" },
            { name: "google", img: "https://i.ibb.co/xYxZJZC/google.jpg" },
            { name: "spotify", img: "https://i.ibb.co/7p4k1yH/spotify.jpg" },
            { name: "amazon", img: "https://i.ibb.co/c3kQm7B/amazon.jpg" },
            { name: "paypal", img: "https://i.ibb.co/YbJ9TzS/paypal.jpg" },
            { name: "netflix", img: "https://i.ibb.co/6gXqRzJ/netflix.jpg" },
            { name: "airbnb", img: "https://i.ibb.co/5kY4HcB/airbnb.jpg" },
            { name: "uber", img: "https://i.ibb.co/ThzF1qX/uber.jpg" },
            { name: "discord", img: "https://i.ibb.co/8bJ4fR6/discord.jpg" },
            { name: "reddit", img: "https://i.ibb.co/YQG5szF/reddit.jpg" },
            { name: "shazam", img: "https://i.ibb.co/B6V1m3h/shazam.jpg" },
            { name: "telegram", img: "https://i.ibb.co/s3jK2kL/telegram.jpg" },
            { name: "pinterest", img: "https://i.ibb.co/2kY1bJq/pinterest.jpg" },
            { name: "twitch", img: "https://i.ibb.co/G5F7J8S/twitch.jpg" },
            { name: "skype", img: "https://i.ibb.co/3mKx2vB/skype.jpg" },
            { name: "viber", img: "https://i.ibb.co/4ZfW1qJ/viber.jpg" },
            { name: "soundcloud", img: "https://i.ibb.co/1Lz7K8N/soundcloud.jpg" },
            { name: "snapseed", img: "https://i.ibb.co/0v1Q2yF/snapseed.jpg" },
            { name: "evernote", img: "https://i.ibb.co/TK2x0KJ/evernote.jpg" },
            { name: "skyscanner", img: "https://i.ibb.co/f4sY7Bq/skyscanner.jpg" },
            { name: "tripadvisor", img: "https://i.ibb.co/Z6xF9YJ/tripadvisor.jpg" },
            { name: "zoom", img: "https://i.ibb.co/bQY7H8L/zoom.jpg" },
            { name: "quora", img: "https://i.ibb.co/3kR9J1T/quora.jpg" },
            { name: "slack", img: "https://i.ibb.co/LnG5h4R/slack.jpg" }
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
            answer: item.name.toLowerCase(),
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
