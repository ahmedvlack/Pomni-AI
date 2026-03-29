let handler = async (m, { conn }) => {
    const vn = './media/بودعك.mp3'

    conn.sendPresenceUpdate('recording', m.chat)

    await conn.sendMessage(
        m.chat,
        {
            audio: { url: vn },
            ptt: true,
            mimetype: 'audio/mpeg',
            fileName: 'deja de llorar.mp3'
        },
        { quoted: m }
    )
}

// تشغيل تلقائي عند كتابة الكلمات
handler.customPrefix = /^(بودعك|الوداع)$/i

// مهم جداً للتشغيل التلقائي
handler.before = true

export default handler
