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

// أوامر ثابتة فقط
handler.command = ['بودعك', 'الوداع']

export default handler
