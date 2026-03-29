import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

  // رسالة عند عدم إدخال نص
  if (!text) return m.reply(`
╮───────────────────────╭ـ
مرحبا بك فى بوت بلاك 🤖

مثال:
│❏ بوت من نيكولا تسلا
│❏ بوت افضل انمى
│❏ بوت هات فزورة أو لغز
╰───────────────────────╯
`)

  await m.reply(wait)

  let sender = m.sender

  try {

    let aiAnswer = await askAI(text)

    let percent = Math.floor(Math.random() * 101)

    let msg = `*هــل ${text}*\n\n*الــأجــابـه :* ${aiAnswer}\n*الـنـسـبـة :* ${percent}%`

    await conn.sendMessage(m.chat, {
      text: msg,
      mentions: [sender]
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply('❌ حدث خطأ في الذكاء الاصطناعي')
  }
}

handler.command = /^هل$/i
handler.group = true
handler.tags = ['fun']

export default handler

/* ================== AI FUNCTION ================== */

async function askAI(question) {

  let linkaiList = []
  let linkaiId = generateRandomString(21)
  let Baseurl = "https://vipcleandx.xyz/"

  linkaiList.push({
    content: `أجب فقط بكلمة واحدة (نعم أو لا أو ربما) على السؤال:\n${question}`,
    role: "user",
    time: formatTime(),
    isMe: true
  })

  linkaiList.push({
    content: "thinking...",
    role: "assistant",
    time: formatTime(),
    isMe: false
  })

  let response = await fetch(Baseurl + "v1/chat/gpt/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": generateRandomIP(),
      "Referer": Baseurl,
      "accept": "application/json"
    },
    body: JSON.stringify({
      list: linkaiList,
      id: linkaiId,
      title: question,
      prompt: "Answer briefly.",
      temperature: 0.5,
      models: "0",
      continuous: true
    })
  })

  let data = await response.text()

  try {
    let json = JSON.parse(data)

    let result = json?.data || json?.message || json?.content

    if (!result) return "لا أعلم"

    return result

  } catch {
    return data || "لا أعلم"
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

function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
}

function formatTime() {
  let d = new Date()
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}
