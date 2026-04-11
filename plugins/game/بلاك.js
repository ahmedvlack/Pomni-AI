let handler = async (m, { conn, text }) => {
  if (!text) throw '*اسـالــنى يــبـــرو 💐 !*'

  let sender = m.sender

  let answers = [
    'اه',
    'ممكن',
    'في الاغلب اه',
    'ف الاغلب لا',
    'لا',
    'مستحيل'
  ]

  let answer = answers[Math.floor(Math.random() * answers.length)]
  let percent = Math.floor(Math.random() * 101)

  let msg = `
*💫 اسآل بلاڪ 💫*

*السؤال:* ${text}
*الاجابة:* ${answer}
*النسبة:* ${percent}%
`.trim()

  await conn.sendMessage(m.chat, {
    text: msg,
    mentions: [sender]
  }, { quoted: m })
}

// الأمر
handler.command = /^بلاك|بلاكى$/i

// 👇 هذا هو المهم
handler.category = 'games'

// اختياري
handler.group = true

export default handler