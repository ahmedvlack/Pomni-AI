import axios from 'axios'
import similarity from 'similarity'

const threshold = 0.72
const winScore = 10
const reward = 1
const minTime = 15000
const timeDecrease = 5000

// 🔊 صوت الجمهور
const cheerSound = 'https://files.catbox.moe/8njh5p.mp3'

// الزخرفة
const decoTop = "╮───────────────────────╭ـ"
const decoBottom = "╯───────────────────────╰ـ"

let handler = async (m, { conn }) => {
    conn.quiz = conn.quiz ? conn.quiz : {}
    conn.quizScore = conn.quizScore ? conn.quizScore : {}
    conn.quizTime = conn.quizTime ? conn.quizTime : {}

    let id = m.chat

    // 🎮 بدء اللعبة
    if (id in conn.quiz) {
        return m.reply(`${decoTop}
❌ فيه سؤال شغال بالفعل!
${decoBottom}`)
    }

    if (!conn.quizTime[id]) conn.quizTime[id] = 60000

    await sendQuestion(conn, m)
}

handler.before = async function (m) {
    this.quiz = this.quiz ? this.quiz : {}
    this.quizScore = this.quizScore ? this.quizScore : {}
    this.quizTime = this.quizTime ? this.quizTime : {}

    let id = m.chat
    if (!(id in this.quiz)) return

    if (!m.text) return

    let data = this.quiz[id]
    let json = data[1]
    let answer = json.response.toLowerCase().trim()

    if (m.text.toLowerCase() == answer) {
        let user = m.sender

        if (!this.quizScore[user]) this.quizScore[user] = 0
        this.quizScore[user] += reward

        let score = this.quizScore[user]

        // 🔊 صوت الجمهور
        await this.sendMessage(m.chat, {
            audio: { url: cheerSound },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

        m.reply(`${decoTop}
✅ إجابة صحيحة!
🎯 نقاطك: ${score}/${winScore}
${decoBottom}`)

        clearTimeout(data[3])
        delete this.quiz[id]

        this.quizTime[id] = Math.max(minTime, this.quizTime[id] - timeDecrease)

        // 🏆 عند الفوز (نهاية الجولة)
        if (score >= winScore) {

            let scores = this.quizScore || {}
            let sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])

            let text = `${decoTop}
🏆 الفائز: @${user.split('@')[0]} 🎉

📊 الترتيب النهائي:

`
            let mentions = []

            sorted.forEach((u, i) => {
                text += `${i + 1}- @${u[0].split('@')[0]} : ${u[1]} نقطة\n`
                mentions.push(u[0])
            })

            text += decoBottom

            await this.reply(m.chat, text, m, { mentions })

            // 🔄 إعادة ضبط
            this.quizScore = {}
            this.quizTime[id] = 60000
            return
        }

        await sendQuestion(this, m)

    } else if (m.text.toLowerCase() == 'انسحاب') {

        m.reply(`${decoTop}
😒 انسحبت من السؤال
${decoBottom}`)

        clearTimeout(data[3])
        delete this.quiz[id]

    } else if (m.text.toLowerCase() == 'تلميح') {

        m.reply(`${decoTop}
💡 الإجابة: ${json.response}
${decoBottom}`)

    } else if (similarity(m.text.toLowerCase(), answer) >= threshold) {

        m.reply(`${decoTop}
🔥 قريب جداً! حاول مرة ثانية
${decoBottom}`)

    } else {

        m.reply(`${decoTop}
❌ إجابة خاطئة
${decoBottom}`)

    }

    return !0
}

async function sendQuestion(conn, m) {
    let id = m.chat

    try {
        const fileId = '1pOFDptzcYxRUnxM_91YeFr7T2fRsQXqO'
        const url = `https://drive.google.com/uc?export=download&id=${fileId}`
        const res = await axios.get(url)

        let data = res.data
        let json = data[Math.floor(Math.random() * data.length)]

        let time = conn.quizTime[id] || 60000

        let caption = `${decoTop}
❓ السؤال: ${json.question || 'من هو هذا اللاعب؟'}
⏳ الوقت: ${time / 1000} ثانية
🏆 أول من يصل ${winScore} نقاط يفوز
${decoBottom}`

        conn.quiz[id] = [
            await conn.sendMessage(m.chat, { image: { url: json.image }, caption }, { quoted: m }),
            json,
            reward,
            setTimeout(() => {
                if (conn.quiz[id]) {
                    conn.reply(m.chat, `${decoTop}
⏰ انتهى الوقت!
✅ الإجابة: ${json.response}
${decoBottom}`)
                    delete conn.quiz[id]
                }
            }, time)
        ]

    } catch (e) {
        console.log(e)
        m.reply(`${decoTop}
❌ خطأ في جلب السؤال
${decoBottom}`)
    }
}

handler.command = /^كوره$/i
handler.help = ['كوره']
handler.tags = ['game']

export default handler
