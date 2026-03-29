import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {

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

  try {
    let result = await askAI(text)

    await m.reply(`
╮───────────────────────╭ـ
${result}
╰───────────────────────╯
`)
  } catch (e) {
    console.log(e)
    await m.reply('وقعت مشكلة مع الذكاء الاصطناعي 😢')
  }
}

handler.help = ["بوت"]
handler.tags = ["ai"]
handler.command = /^(بوت)$/i

export default handler

/* ================== AI بدون مفتاح ================== */

async function askAI(text) {
  const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text
    })
  })

  const data = await response.json()

  return data?.generated_text || data?.[0]?.generated_text || "لم أستطع توليد رد."
}
