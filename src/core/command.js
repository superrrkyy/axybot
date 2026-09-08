import { logger } from "./logger.js";

import {
  checkPermission
} from "../middleware/permissions.js";


/*
 * =========================
 * COMMAND REGISTRY
 * =========================
 */

const commands = new Map();


/*
 * =========================
 * REGISTER COMMAND
 * =========================
 */

export function registerCommand(command) {

  if (!command?.name) {
    throw new Error(
      "Command harus memiliki name"
    );
  }


  if (
    typeof command.execute !==
    "function"
  ) {

    throw new Error(
      `Command ${command.name} tidak memiliki execute()`
    );
  }


  const names = [
    command.name,
    ...(command.aliases || [])
  ];


  for (const name of names) {

    commands.set(
      name.toLowerCase(),
      command
    );

  }


  logger.info(
    `Command loaded: ${command.name}`
  );
}


/*
 * =========================
 * GET COMMAND
 * =========================
 */

export function getCommand(name) {

  if (!name) {
    return null;
  }


  return (
    commands.get(
      name.toLowerCase()
    ) || null
  );
}


/*
 * =========================
 * PARSE COMMAND
 * =========================
 */

export function parseCommand(text) {

  if (!text) {
    return null;
  }


  const cleanText =
    text.trim();


  if (!cleanText) {
    return null;
  }


  const parts =
    cleanText.split(/\s+/);


  const name =
    parts
      .shift()
      ?.toLowerCase();


  if (!name) {
    return null;
  }


  return {
    name,
    args: parts,
    raw: cleanText
  };
}


/*
 * =========================
 * EXECUTE COMMAND
 * =========================
 */

export async function executeCommand(
  sock,
  data
) {

  const parsed =
    parseCommand(data.text);


  if (!parsed) {
    return false;
  }


  const command =
    getCommand(parsed.name);


  /*
   * COMMAND TIDAK DITEMUKAN
   */

  if (!command) {

    logger.warn(
      `Unknown command: ${parsed.name} sender=${data.sender}`
    );

    await sock.sendMessage(
      data.jid,
      {
        text:
          `❌ Command "${parsed.name}" tidak ditemukan.`
      }
    );

    return true;
  }


  /*
   * =========================
   * PERMISSION
   * =========================
   */

  const permission =
    await checkPermission(

      command,

      data.sender,

      data.senderAlt,

      sock,

      data.jid

    );


  logger.info(
    `Permission result: ${parsed.name} ` +
    `allowed=${permission.allowed} ` +
    `reason=${permission.reason}`
  );


  /*
   * =========================
   * PERMISSION DENIED
   * =========================
   */

  if (!permission.allowed) {

    if (
      permission.reason ===
      "owner_only"
    ) {

      await sock.sendMessage(
        data.jid,
        {
          text:
            "❌ Command ini khusus owner."
        }
      );

    }

    else if (
      permission.reason ===
      "admin_only"
    ) {

      await sock.sendMessage(
        data.jid,
        {
          text:
            "❌ Command ini khusus admin."
        }
      );

    }

    else if (
      permission.reason ===
      "premium_only"
    ) {

      await sock.sendMessage(
        data.jid,
        {
          text:
            "⭐ Command ini khusus pengguna Premium."
        }
      );

    }

    else {

      await sock.sendMessage(
        data.jid,
        {
          text:
            "❌ Kamu tidak memiliki izin."
        }
      );

    }


    logger.warn(
      `Permission denied: ` +
      `${parsed.name} ` +
      `sender=${data.sender} ` +
      `senderAlt=${data.senderAlt || "-"} ` +
      `reason=${permission.reason}`
    );


    return true;
  }


  /*
   * =========================
   * LOG
   * =========================
   */

  logger.command(
    parsed.name,
    data.jid
  );


  /*
   * =========================
   * EXECUTE
   * =========================
   */

  try {

    await command.execute({

      sock,

      ...data,

      ...parsed

    });


    logger.info(
      `Command executed: ${parsed.name}`
    );


  } catch (error) {

    logger.error(
      `Command error: ${parsed.name} ` +
      `${error.message}`
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
        `Failed to send error message: ` +
        `${sendError.message}`
      );

    }

  }


  return true;
}


/*
 * =========================
 * GET ALL COMMANDS
 * =========================
 */

export function getCommands() {

  return [
    ...new Set(
      commands.values()
    )
  ];

}
