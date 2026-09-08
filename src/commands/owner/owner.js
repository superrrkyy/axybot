export default {
  name: "owner",

  aliases: [],

  description:
    "Menampilkan informasi owner",

  category: "owner",

  usage: "owner",

  ownerOnly: true,

  adminOnly: false,

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
│ 👑 OWNER
├────────────────────┤
│ Status : Owner
│ Access : Full
│ Core   : axybot V5
╰────────────────────╯`
      }
    );

  }
};
