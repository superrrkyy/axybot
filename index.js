import { startConnection } from "./src/core/connection.js";
import { registerMessageHandler } from "./src/core/message.js";
import { loadCommands } from "./src/core/loader.js";

console.clear();

console.log(`
╔════════════════════════════════╗
║          AX YBOT CORE V5       ║
║                                ║
║      WhatsApp Bot Framework    ║
╚════════════════════════════════╝
`);

await loadCommands();

const sock = await startConnection();

registerMessageHandler(sock);

process.on("SIGINT", async () => {
  console.log("\n");
  console.log("🛑 Shutting down axybot...");
  console.log("💾 Menyimpan session...");
  console.log("👋 axybot Core V5 stopped.");

  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n");
  console.log("🛑 SIGTERM received.");
  console.log("👋 axybot Core V5 stopped.");

  process.exit(0);
});
