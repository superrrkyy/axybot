import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import pino from "pino";
import qrcode from "qrcode-terminal";

export async function startConnection() {
  const { state, saveCreds } = await useMultiFileAuthState("./sessions");

  const sock = makeWASocket({
    auth: state,

    logger: pino({
      level: "silent"
    }),

    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {

    if (qr) {
      console.log("\n📱 Scan QR Code ini dengan WhatsApp:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("\n╭─────────────────────────╮");
      console.log("│       AX YBOT CORE V5   │");
      console.log("│                         │");
      console.log("│   🟢 WhatsApp Connected │");
      console.log("╰─────────────────────────╯\n");
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      const shouldReconnect =
        statusCode !== DisconnectReason.loggedOut;

      console.log("🔴 WhatsApp disconnected.");

      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startConnection();
      } else {
        console.log("⚠️ Session logout. Scan QR kembali.");
      }
    }
  });

  return sock;
}
