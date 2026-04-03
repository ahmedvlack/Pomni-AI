import { Client } from 'whatsappy';
import { group, access } from "./system/control.js";

/* =========== client ======== */

const client = new Client({
  phoneNumber: '584261453009', // bot number 
  info: { 
   nameBot: "Pomni AI", 
   nameChannel: "𝐃𝐀𝐑𝐊 𝐋𝐎𝐑𝐃𝐒 𝐓𝐄𝐀𝐌  🇪🇬 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️", 
   idChannel: "120363291329944922@newsletter"
},
  commandsPath: './plugins',
  prefix: [".", "/", "!"],
  owners: [
  // Owner 1
      { name: "Afroto",
      lid: "264609126691001@lid", jid: "201067999523@s.whatsapp.net" },
      
  // Owner 2
      { name: "black",
       lid: "77039247822892@lid", jid: "994407941269@s.whatsapp.net" },
       
  // Owner 3
      { name: "كارثه بيه", 
      jid: "212776030802@s.whatsapp.net", lid: "3775964147906@lid" }
  ],
  fromMe: false,
  showLogs: true,
});

client.onGroupEvent(group)
client.onCommandAccess(access);


/* =========== function start ======== */
client.start();
