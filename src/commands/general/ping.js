export default {
  name: "ping",

  aliases: ["p"],

  description: "Mengecek status axybot",

  category: "general",

  usage: "ping",

  premium: false,

  async execute({ sock, jid }) {
    await sock.sendMessage(jid, {
      text:
        "🏓 Pong!\n\n" +
        "🟢 axybot Core V5 aktif."
    });
  }
};
