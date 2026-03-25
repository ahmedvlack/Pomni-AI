let user = a => '@' + a.split('@')[0]

export default async function handler(m, { groupMetadata, conn }) {
  // يتأكد أن الرسالة تبدأ بـ "هل"
  if (!m.text || !m.text.startsWith('هل')) return

  let text = m.text.replace('هل', '').trim()
  if (!text) return conn.reply(m.chat, '*أدخــل الـسـؤال !*', m)

  // منشن صاحب الرسالة
  let sender = m.sender

  // رد عشوائي
  let answer = pickRandom([
    'احــتـمـال قـلـيـل',
    'نــعم بـالـتـأكـيد',
    'لا أعـتـقـد',
    'مــستـحـيــل',
    'غــالـبـاً نــعــم',
    'مــمـكـن'
  ])

  // نسبة عشوائية
  let percent = Math.floor(Math.random() * 101)

  let top = `*هــل ${text}*\n\n*الــأجــابـه :* ${answer}\n*الـنـسـبـة :* ${percent}%`

  conn.reply(m.chat, top, m, { mentions: [sender] })
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
