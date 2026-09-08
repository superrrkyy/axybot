import { normalizeMessage } from "./normalize.js";
import { executeCommand } from "./command.js";
import { handleInteractive } from "./interactive.js";
import { logger } from "./logger.js";
import { ensureUser } from "../users/service.js";

export function registerMessageHandler(sock) {
  sock.ev.on(
    "messages.upsert",
    async ({ messages }) => {

for (const message of messages) {

  // Jangan proses pesan yang dikirim oleh bot sendiri
  if (message.key?.fromMe) {
    continue;
  }

  if (!message.message) {
    continue;
  }

        /*
         * =========================
         * NATIVE BUTTON HANDLER
         * =========================
         */

        try {
          const interactiveHandled =
            await handleInteractive(
              sock,
              message
            );

          if (interactiveHandled) {
            continue;
          }

        } catch (error) {

          logger.error(
            `Interactive handler error: ${error.message}`
          );

          console.error(error);

          continue;
        }


        /*
         * =========================
         * NORMAL MESSAGE
         * =========================
         */

        const data =
          normalizeMessage(message);

        if (!data) continue;

const user =
  ensureUser(data);

if (!user) {
  logger.warn(
    "User tidak dapat didaftarkan."
  );
}

        logger.info(
          `Message received from ${data.jid}`
        );


        /*
         * =========================
         * COMMAND EXECUTION
         * =========================
         */

        try {

          const executed =
            await executeCommand(
              sock,
              data
            );


          if (executed) {

            logger.info(
              `Command executed: ${data.text}`
            );

          }

        } catch (error) {

          logger.error(
            `Command error: ${error.message}`
          );

          console.error(error);


          try {

            await sock.sendMessage(
              data.jid,
              {
                text:
                  "❌ Terjadi kesalahan saat menjalankan command."
              }
            );

          } catch (sendError) {

            logger.error(
              `Failed to send error message: ${sendError.message}`
            );

          }

        }
      }
    }
  );
}
