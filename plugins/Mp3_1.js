import axios from 'axios';

let handler = async (m, { conn }) => {

    const vn = 'https://files.catbox.moe/iaimvj.mp3';

    try {
        // فحص الرابط بطريقة أقوى من HEAD
        const res = await axios.get(vn, {
            responseType: 'arraybuffer',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!res || !res.data) throw new Error('فشل تحميل الصوت');

        // إظهار حالة التسجيل
        await conn.sendPresenceUpdate('recording', m.chat);

        // محاكاة مدة التسجيل
        await new Promise(resolve => setTimeout(resolve, 3000));

        // إرسال الصوت بعد التأكد أنه تم تحميله
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: vn },
                ptt: true,
                mimetype: 'audio/ogg; codecs=opus',
                fileName: 'voice.ogg'
            },
            { quoted: m }
        );

        await conn.sendPresenceUpdate('paused', m.chat);

    } catch (err) {
        console.log(err);
        return m.reply('❌ الرابط لا يعمل أو لا يمكن تحميل الصوت حالياً');
    }
};

handler.help = ['notification'];
handler.tags = ['notification'];
handler.command = ['الوداع', 'بودعك'];
handler.customPrefix = /^(بودعك|الوداع)$/i;

export default handler;
