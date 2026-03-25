let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, conn, text }) {
  if (!text) throw `*أدخــل الـسـؤال !*`

  // منشن صاحب الرسالة
  let sender = m.sender

  // اختيار رد عشوائي
  let answer = pickRandom([
    'احــتـمـال قـلـيـل',
    'نــعم بـالـتـأكـيد',
    'لا أعـتـقـد',
    'مــستـحـيــل',
    'غــالـبـاً نــعــم',
    'مــمـكـن'
  ])

  // نسبة مئوية عشوائية
  let percent = Math.floor(Math.random() * 101) // من 0 لـ 100

  let top = `*هــل ${text}*\n\n*الــأجــابـه :* ${answer}\n*الـنـسـبـة :* ${percent}%`

  conn.reply(m.chat, top, m, { mentions: [sender] })
}

handler.help = handler.command = ['هل']
handler.tags = ['fun']
handler.group = true
handler.limit = 0

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
