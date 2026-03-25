let user = a => '@' + a.split('@')[0]

// دالة الرد
async function replyQuestion(conn, m, text) {
  if (!text) throw '*أدخــل الـسـؤال !*'

  let sender = m.sender

  let answers = [
    'احــتـمـال قـلـيـل',
    'نــعم بـالـتـأكـيد',
    'لا أعـتـقـد',
    'مــستـحـيــل',
    'غــالـبـاً نــعــم',
    'مــمـكـن'
  ]

  let answer = answers[Math.floor(Math.random() * answers.length)]
  let percent = Math.floor(Math.random() * 101)

  let msg = `*هــل ${text}*\n\n*الــأجــابـه :* ${answer}\n*الـنـسـبـة :* ${percent}%`

  await conn.sendMessage(m.chat, { 
    text: msg, 
    mentions: [sender] 
  })
}

// مثال استخدام (داخل events الرسائل)
conn.ev.on('messages.upsert', async ({ messages }) => {
  let m = messages[0]
  if (!m.message) return

  let text = m.message.conversation || m.message.extendedTextMessage?.text
  if (!text) return

  // لو الرسالة تبدأ بـ "هل"
  if (text.startsWith('هل ')) {
    let question = text.slice(3)
    await replyQuestion(conn, m, question)
  }
})
