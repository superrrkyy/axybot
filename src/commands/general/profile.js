import {
  getUser
} from "../../users/manager.js";

function createProgressBar(
  current,
  required,
  size = 10
) {
  const percentage =
    Math.min(
      current / required,
      1
    );

  const filled =
    Math.round(
      percentage * size
    );

  return (
    "█".repeat(filled) +
    "░".repeat(size - filled)
  );
}

export default {
  name: "profile",

  aliases: [
    "me",
    "profil"
  ],

  description:
    "Melihat profile user",

  category: "general",

  usage: "profile",

  premium: false,

  async execute({
    sock,
    sender,
    jid
  }) {

    const user =
      getUser(sender);

    if (!user) {
      await sock.sendMessage(jid, {
        text:
          "❌ Data user belum tersedia."
      });

      return;
    }

    const requiredXP =
      user.level * 100;

    const progress =
      createProgressBar(
        user.xp,
        requiredXP
      );

    const premiumStatus =
      user.premium
        ? "⭐ Premium"
        : "Free";

    await sock.sendMessage(jid, {
      text:
        "╭───「 👤 PROFILE 」\n" +
        `│ Nama   : ${user.name}\n` +
        `│ Level  : ${user.level}\n` +
        `│ XP     : ${user.xp}/${requiredXP}\n` +
        `│        ${progress}\n` +
        `│ Coin   : ${user.coin}\n` +
        `│ Status : ${premiumStatus}\n` +
        "╰────────────────"
    });
  }
};
