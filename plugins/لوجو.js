async function handler(m, { conn }) {
    if (!global.gameActive) global.gameActive = {};

    if (global.gameActive[m.chat]) {
        clearTimeout(global.gameActive[m.chat].timeout);
        delete global.gameActive[m.chat];
    }

    try {
        const data = [
            { answers: ["facebook","fb","فيسبوك","فيس"], img: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
            { answers: ["instagram","insta","ig","انستجرام","انستا"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png" },
            { answers: ["whatsapp","واتساب","واتس","wa"], img: "https://cdn-icons-png.flaticon.com/512/733/733585.png" },
            { answers: ["youtube","yt","يوتيوب"], img: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
            { answers: ["twitter","x","تويتر"], img: "https://cdn-icons-png.flaticon.com/512/733/733579.png" },
            { answers: ["tiktok","تيك توك","tik tok"], img: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png" },
            { answers: ["snapchat","سناب","سناب شات"], img: "https://cdn-icons-png.flaticon.com/512/733/733576.png" },
            { answers: ["telegram","تلجرام","تيليجرام"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png" },
            { answers: ["discord","ديسكورد"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png" },
            { answers: ["linkedin","لينكدان"], img: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
            { answers: ["pinterest","بنترست"], img: "https://cdn-icons-png.flaticon.com/512/733/733558.png" },
            { answers: ["spotify","سبوتيفاي"], img: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
            { answers: ["netflix","نتفليكس"], img: "https://cdn-icons-png.flaticon.com/512/5977/5977590.png" },
            { answers: ["amazon","امازون"], img: "https://cdn-icons-png.flaticon.com/512/5968/5968784.png" },
            { answers: ["paypal","بايبال"], img: "https://cdn-icons-png.flaticon.com/512/174/174861.png" },
            { answers: ["reddit","ريديت"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111589.png" },
            { answers: ["skype","سكايب"], img: "https://cdn-icons-png.flaticon.com/512/174/174869.png" },
            { answers: ["viber","فايبر"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111708.png" },
            { answers: ["slack","سلاك"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png" },
            { answers: ["zoom","زووم"], img: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png" },
            { answers: ["google","جوجل"], img: "https://cdn-icons-png.flaticon.com/512/300/300221.png" },
            { answers: ["apple","ابل"], img: "https://cdn-icons-png.flaticon.com/512/0/747.png" },
            { answers: ["github","جيت هاب"], img: "https://cdn-icons-png.flaticon.com/512/733/733553.png" },
            { answers: ["twitch","تويتش"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111668.png" },
            { answers: ["ebay","ايباي"], img: "https://cdn-icons-png.flaticon.com/512/732/732221.png" },
            { answers: ["wechat","ويتشات"], img: "https://cdn-icons-png.flaticon.com/512/2111/2111728.png" },
            { answers: ["messenger","ماسنجر"], img: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
            { answers: ["quora","كورا"], img: "https://cdn-icons-png.flaticon.com/512/733/733600.png" },
            { answers: ["tripadvisor","تريب ادفايزر"], img: "https://cdn-icons-png.flaticon.com/512/733/733597.png" },
            { answers: ["uber","اوبر"], img: "https://cdn-icons-png.flaticon.com/512/732/732200.png" }
        ];

        const item = data[Math.floor(Math.random() * data.length)];

        const msg = await conn.sendMessage(m.chat, {
            image: { url: item.img },
            caption: `
╮───────────────────────╭
│ ❓ *ما اسم هذا التطبيق؟*
│ ⏳ *الوقت:* 30 ثانية
│ 💰 *الجائزة:* 500 نقطة
╯───────────────────────╰
رد على الرسالة بالإجابة
            `.trim()
        });

        global.gameActive[m.chat] = {
            answers: item.answers,
            timeout: setTimeout(() => {
                if (global.gameActive[m.chat]) {
                    const ans = global.gameActive[m.chat].answers[0];
                    delete global.gameActive[m.chat];
                    conn.sendMessage(m.chat, {
                        text: `⏰ انتهى الوقت\n✅ *الإجابة:* ${ans}`
                    }, { quoted: m });
                }
            }, 30000)
        };

    } catch (e) {
        console.log(e);
        m.reply("❌ حدث خطأ في اللعبة");
    }
}


// 🔥 دالة الذكاء
function similarity(s1, s2) {
    let longer = s1.length > s2.length ? s1 : s2;
    let shorter = s1.length > s2.length ? s2 : s1;
    let longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


// ✅ التحقق
handler.before = async (m) => {
    if (!m.text) return false;

    const game = global.gameActive?.[m.chat];
    if (!game) return false;

    const userAnswer = m.text.toLowerCase().trim();

    for (let ans of game.answers) {
        if (userAnswer === ans || similarity(userAnswer, ans) >= 0.7) {
            clearTimeout(game.timeout);
            delete global.gameActive[m.chat];

            await m.reply(`
🎉 *إجابة صحيحة!*  
💰 +500 نقطة
            `);
            return true;
        }
    }

    return false;
};

handler.command = ["لوجو","logo"];
handler.category = "games";

export default handler;
