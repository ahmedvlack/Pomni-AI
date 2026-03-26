let handler = async (m, { conn, text }) => {
  if (!text) throw '*أدخــل الـسـؤال !*'

  let sender = m.sender

  // قائمة الإجابات (بدون أي دالة خارجية)
  let answers = [
    'اه',
    'ممكن',
    'في الاغلب اه',
    'ف الاغلب لا',
    'لا',
    'مستحيل'
  ]

  // اختيار عشوائي
  let answer = answers[Math.floor(Math.random() * answers.length)]

  // نسبة مئوية
  let percent = Math.floor(Math.random() * 101)

  let msg = `
*💫 اسآل بلاك 💫*

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

// نفس التصنيفات
handler.tags = ['fun']

// اختياري لو تبيه قروبات فقط
handler.group = true

export default handler
