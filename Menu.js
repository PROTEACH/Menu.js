const { bot, getBuffer, jidToNum, genThumbnail } = require('../lib/');
const { VERSION } = require('../config');
const {
  textToStylist,
  getUptime,
  PLUGINS,
  getRam,
  addSpace,
} = require('../lib/');
const url1 = 'https://files.catbox.moe/oxmh9a.jpeg';
const url2 = 'https://files.catbox.moe/oxmh9a.jpeg';

bot(
  {
    pattern: 'p&k ?(.*)',
    desc: 'custom Menu',
    type: 'misc',
  },
  async (message, match, ctx) => {
    const jid = message.jid;
    const number = message.client.user.jid;
    const thumb = await getBuffer(url1);
    const thumbnail = await getBuffer(url2);

    const date = new Date();
    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    const commands = {};
    ctx.commands.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        let cmdType = command.type.toLowerCase();
        if (!commands[cmdType]) commands[cmdType] = [];
        let isDisabled = command.active === false;
        let cmd = command.name.trim();
        commands[cmdType].push(isDisabled ? cmd + ' [disabled]' : cmd);
      }
    });

    let CMD_HELP = `╭━─━─━─≪✠≫─━─━─━╮
       *〄 PX TEACH ⎙*
╰━─━─━─≪✠≫─━─━─━╯

╭━─━─━─≪✠≫─━─━─━╮
│   📅 *Date:* ${date.toLocaleDateString('en')}
│   ⏰ *Time:* ${date.toLocaleTimeString()}
│   ❄️ *Day:* ${date.toLocaleString('en', { weekday: 'long' })}
│   ✨ *Version:* ${VERSION}
│   🪻 *RAM:* ${getRam()}
│   ⏳ *Uptime:* ${getUptime('t')}
╰━─━─━─≪✠≫─━─━─━╯
`;

    for (let cmdType in commands) {
      CMD_HELP += `╭━─━─━─≪❥≫
│   *${cmdType.toUpperCase()} ❞*
╰━─━─━─≪❥≫\n`;

      commands[cmdType].forEach((cmd) => {
        CMD_HELP += `│ ✗ ${textToStylist(cmd, 'mono')}\n`;
      });
    }

    const Data = {};
    Data.linkPreview = {
      renderLargerThumbnail: true,
      showAdAttribution: true,
      head: 'P X - C O D E ',
      body: 'PX ＣＯＤＥ',
      mediaType: 1,
      thumbnail: thumb.buffer,
      sourceUrl: 'http://wa.me/919679804705?text= ◄⏤͟͞ꭙͯ͢³ＰＡＴＨＩＫ〆𝆺꯭𝅥𓆩〭⃛〬🫶❤️‍🩹𓆪̥_',
    };

    Data.quoted = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
      },
      message: {
        contactMessage: {
          displayName: `${message.pushName}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${message.client.user.name},;;;\nFN:${message.client.user.name},\nitem1.TEL;waid=${jidToNum(number)}\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`,
          jpegThumbnail: await genThumbnail(thumbnail.buffer),
        },
      },
    };

    return await message.send(`${CMD_HELP}`, Data);
  }
);