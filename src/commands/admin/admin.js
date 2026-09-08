export default {
  name: "admin",

  aliases: [],

  description:
    "Menampilkan informasi admin",

  category: "admin",

  usage: "admin",

  ownerOnly: false,

  adminOnly: true,

  premium: false,

  async execute({
    sock,
    jid
  }) {

    await sock.sendMessage(
      jid,
      {
        text:
`╭────────────────────╮
│ 🛡️ ADMIN
├────────────────────┤
│ Status : Admin
│ Access : Moderation
│ Core   : axybot V5
╰────────────────────╯`
      }
    );

  }
};
