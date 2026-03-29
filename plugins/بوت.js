import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  if (!text) {
    return m.reply(`
╮───────────────────────╭ـ
مرحبا بك فى بوت بلاك 🤖

✔ تم تفعيل المحادثة الذكية

الآن يمكنك الرد على البوت وسيجيبك تلقائياً بالذكاء الاصطناعي

مثال:
│❏ اكتب أي سؤال
│❏ أو رد على رسالة البوت
╰───────────────────────╯
`)
  }

  await m.reply(wait)

  let ai = await askAI(text)

  await conn.sendMessage(m.chat, {
    text: `
╮───────────────────────╭ـ
${ai}
╰───────────────────────╯
`,
    quoted: m
  })
}

handler.help = ["بوت"]
handler.tags = ["ai"]
handler.command = /^(بوت)$/i

export default handler

/* ================== AUTO REPLY AI ================== */

handler.before = async function (m, { conn }) {

  // تجاهل الرسائل بدون رد
  if (!m.quoted || !m.quoted.fromMe) return

  // منع تفعيل على أوامر البوت الأخرى
  if (!m.text) return

  try {
    let ai = await askAI(m.text)

    await conn.sendMessage(m.chat, {
      text: `
╮───────────────────────╭ـ
${ai}
╰───────────────────────╯
`,
      quoted: m
    })

  } catch (e) {
    console.log(e)
  }
}

/* ================== AI FUNCTION ================== */

async function askAI(text) {

  let Baseurl = "https://vipcleandx.xyz/"

  let response = await fetch(Baseurl + "v1/chat/gpt/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": Baseurl
    },
    body: JSON.stringify({
      list: [
        {
          content: text,
          role: "user",
          time: formatTime(),
          isMe: true
        }
      ],
      id: generateRandomString(21),
      title: text,
      prompt: "You are a helpful AI assistant.",
      temperature: 0.7,
      models: "0",
      continuous: true
    })
  })

  let data = await response.text()

  try {
    let json = JSON.parse(data)

    return json?.data || json?.message || json?.content || "لا يوجد رد"

  } catch {
    return data || "لا يوجد رد"
  }
}

/* ================== HELPERS ================== */

function generateRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function formatTime() {
  let d = new Date()
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}
