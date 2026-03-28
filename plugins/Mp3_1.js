let handler = async (m, { conn }) => {

    const vn = 'https://files.catbox.moe/iaimvj.mp3';

    conn.sendPresenceUpdate('recording', m.chat);

    await conn.sendMessage(
        m.chat,
        {
            audio: { url: vn },
            ptt: true,
            mimetype: 'audio/mpeg',
            fileName: 'deja de llorar.mp3'
        },
        { quoted: m }
    );
};

handler.help = ['notification'];
handler.tags = ['notification'];
handler.command = ['الوداع', 'بودعك'];
handler.customPrefix = /^(بودعك|الوداع)$/i;

export default handler;
