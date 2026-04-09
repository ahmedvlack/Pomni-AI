import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'system');
const DB_PATH = path.join(DB_DIR, 'database.json');

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

function loadDB() {
    if (existsSync(DB_PATH)) {
        try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } 
        catch { return {}; }
    }
    return {};
}

function saveDB(data) {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function handler(m, { conn, command, args }) {
    if (!global.database) global.database = loadDB();

    const db = global.database;
    const chatId = m.chat;
    const subCmd = args[0]?.toLowerCase();

    const menu = `
╭─┈─┈─┈─⟞🕸️⟝─┈─┈─┈─╮
- *.تفعيل ايقاف_الترحيب*
- *.تفعيل تشغيل_الترحيب*
- *.تفعيل تشغيل_الادمن*
- *.تفعيل ايقاف_الادمن*
- *.تفعيل ايقاف_الخاص*
- *.تفعيل تشغيل_الخاص*
- *.تفعيل مضاد_لينكات*
- *.تفعيل ايقاف_مضاد_لينكات*
- *.تفعيل جروب* 🔥 جديد
╰─┈─┈─┈─⟞🕸️⟝─┈─┈─┈─╯
`;

    if (!subCmd) return m.reply(menu);

    if (!db.settings) db.settings = {};
    if (!db.settings[chatId]) db.settings[chatId] = {};

    const actions = {

        'جروب': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].groupControl = true;
            return '*✅ تم تفعيل اوامر الجروب*\n> استخدم (.قفل / .فتح / .تغير)*';
        },

        'ايقاف_الترحيب': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].noWelcome = true;
            return '*✅ ~ تم تفعيل وضع عدم الترحيب*';
        },

        'تشغيل_الترحيب': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].noWelcome = false;
            return '*✅ ~ تم تفعيل وضع الترحيب*';
        },

        'تشغيل_الادمن': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].adminOnly = true;
            return '*✅ ~ تم تفعيل وضع الادمن*';
        },

        'ايقاف_الادمن': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].adminOnly = false;
            return '*✅ ~ تم فك وضع الادمن*';
        },

        'ايقاف_الخاص': () => {
            if (!m.isOwner) return '*❌ ~ هذا الأمر للمطور فقط*';
            db.developerPrivate = true;
            return '*✅ ~ تم تفعيل وضع الخاص للمطور*';
        },

        'تشغيل_الخاص': () => {
            if (!m.isOwner) return '*❌ ~ هذا الأمر للمطور فقط*';
            db.developerPrivate = false;
            return '*✅ ~ تم فك وضع الخاص للمطور*';
        },

        'مضاد_لينكات': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].antiLinks = true;
            return '*✅ ~ تم تفعيل مضاد الروابط*';
        },

        'ايقاف_مضاد_لينكات': () => {
            if (!m.isOwner && !m.isAdmin) return '*❌ ~ هذا الأمر للمشرفين فقط*';
            db.settings[chatId].antiLinks = false;
            return '*✅ ~ تم إيقاف مضاد الروابط*';
        }

    };

    const action = actions[subCmd];
    if (!action) return m.reply(menu);

    const result = action();
    if (typeof result === 'string') {
        if (result.startsWith('*❌')) return m.reply(result);

        saveDB(db);
        global.database = db;
        m.reply(result);
    }
}

handler.before = async (m, { conn }) => {
    if (!global.database) global.database = loadDB();

    const db = global.database;
    const settings = db.settings?.[m.chat] || {};

    const text = (
        m.text ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        ''
    );

    // 🔥 اوامر الجروب الجديدة
    if (settings.groupControl && m.isGroup) {

        if (text === '.قفل') {
            if (!m.isAdmin && !m.isOwner) return;
            await conn.groupSettingUpdate(m.chat, 'announcement');
            return m.reply('🔒 تم قفل الجروب');
        }

        if (text === '.فتح') {
            if (!m.isAdmin && !m.isOwner) return;
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            return m.reply('🔓 تم فتح الجروب');
        }

        if (text === '.تغير') {
            if (!m.isAdmin && !m.isOwner) return;
            await conn.groupRevokeInvite(m.chat);
            return m.reply('🔁 تم تغيير رابط الجروب');
        }
    }

    if (settings.adminOnly && !m.isOwner && !m.isAdmin) return true;
    if (db.developerPrivate && !m.isOwner && !m.isGroup) return true;
    if (db.ban && !m.isOwner && db.ban[m.sender]) return true;

    // 🔥 مضاد الروابط
    if (settings.antiLinks && m.isGroup && !m.isAdmin && !m.isOwner) {

        const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|discord\.gg)/i;

        if (linkRegex.test(text)) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key });
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } catch (e) {
                console.log('ANTI LINK ERROR:', e);
            }
        }
    }
};

handler.usage = ['تفعيل'];
handler.category = 'admin';
handler.command = ['تفعيل'];

export default handler;