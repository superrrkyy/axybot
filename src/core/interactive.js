import {
  proto,
  generateWAMessageFromContent,
  getContentType
} from "@whiskeysockets/baileys";

import {
  getCommands,
  getCommand
} from "./command.js";

import {
  normalizeMessage
} from "./normalize.js";

import {
  logger
} from "./logger.js";

import {
  checkPermission
} from "../middleware/permissions.js";


/*
 * =========================
 * BIZ NODE
 * =========================
 */

function buildBizNode() {

  const privacyModeTs =
    Math.floor(Date.now() / 1000) - 77980457;


  return {

    tag: "biz",

    attrs: {
      actual_actors: "2",
      host_storage: "2",
      privacy_mode_ts:
        String(privacyModeTs)
    },

    content: [

      {
        tag: "interactive",

        attrs: {
          type: "native_flow",
          v: "1"
        },

        content: [

          {
            tag: "native_flow",

            attrs: {
              v: "9",
              name: "mixed"
            }

          }

        ]

      },

      {

        tag: "quality_control",

        attrs: {
          source_type: "third_party"
        }

      }

    ]

  };
}


/*
 * =========================
 * CREATE BUTTON
 * =========================
 */

function createButton(
  displayText,
  id
) {

  return proto.Message
    .InteractiveMessage
    .NativeFlowMessage
    .NativeFlowButton
    .create({

      name: "quick_reply",

      buttonParamsJson:
        JSON.stringify({
          display_text:
            displayText,

          id
        })

    });

}


/*
 * =========================
 * SEND NATIVE MENU
 * =========================
 */

async function sendNativeMenu(
  sock,
  jid,
  title,
  body,
  buttons
) {

  const interactiveMessage =
    proto.Message
      .InteractiveMessage
      .create({

        header:
          proto.Message
            .InteractiveMessage
            .Header
            .create({

              title,

              subtitle:
                "axybot Core V5",

              hasMediaAttachment:
                false

            }),

        body:
          proto.Message
            .InteractiveMessage
            .Body
            .create({

              text: body

            }),

        footer:
          proto.Message
            .InteractiveMessage
            .Footer
            .create({

              text:
                "axybot Core V5"

            }),

        nativeFlowMessage:
          proto.Message
            .InteractiveMessage
            .NativeFlowMessage
            .create({

              buttons,

              messageParamsJson:
                "{}",

              messageVersion: 1

            })

      });


  const message =
    generateWAMessageFromContent(

      jid,

      {

        viewOnceMessage: {

          message: {

            messageContextInfo: {

              deviceListMetadata: {},

              deviceListMetadataVersion:
                2

            },

            interactiveMessage

          }

        }

      },

      {

        userJid:
          sock.user.id

      }

    );


  const additionalNodes = [
    buildBizNode()
  ];


  if (!jid.endsWith("@g.us")) {

    additionalNodes.unshift({

      tag: "bot",

      attrs: {
        biz_bot: "1"
      }

    });

  }


  await sock.relayMessage(

    jid,

    message.message,

    {

      messageId:
        message.key.id,

      additionalNodes

    }

  );

}


/*
 * =========================
 * GET BUTTON ID
 * =========================
 */

export function getNativeFlowId(
  message
) {

  const msg =
    message?.message;


  if (!msg) {
    return null;
  }


  const type =
    getContentType(msg);


  logger.info(
    `Incoming message type: ${type}`
  );


  /*
   * NATIVE FLOW
   */

  if (
    type ===
    "interactiveResponseMessage"
  ) {

    const response =
      msg.interactiveResponseMessage;


    const nativeFlow =
      response?.nativeFlowResponseMessage;


    if (!nativeFlow?.paramsJson) {
      return null;
    }


    try {

      const params =
        JSON.parse(
          nativeFlow.paramsJson
        );


      return (
        params.id ||
        params.button_id ||
        params.selected_id ||
        null
      );

    } catch (error) {

      logger.error(
        `Native Flow JSON error: ${error.message}`
      );

      return null;
    }

  }


  /*
   * TEMPLATE BUTTON
   */

  if (
    type ===
    "templateButtonReplyMessage"
  ) {

    const response =
      msg.templateButtonReplyMessage;


    const id =
      response?.selectedId;


    logger.info(
      `Template button ID: ${id}`
    );


    return id || null;
  }


  /*
   * LEGACY BUTTON
   */

  if (
    type ===
    "buttonsResponseMessage"
  ) {

    const response =
      msg.buttonsResponseMessage;


    const id =
      response?.selectedButtonId;


    logger.info(
      `Legacy button ID: ${id}`
    );


    return id || null;
  }


  /*
   * LIST
   */

  if (
    type ===
    "listResponseMessage"
  ) {

    const response =
      msg.listResponseMessage;


    const id =
      response
        ?.singleSelectReply
        ?.selectedRowId;


    logger.info(
      `List selected ID: ${id}`
    );


    return id || null;
  }


  return null;
}


/*
 * =========================
 * HANDLE INTERACTIVE
 * =========================
 */

export async function handleInteractive(
  sock,
  message
) {

  const id =
    getNativeFlowId(message);


  if (!id) {
    return false;
  }


  const jid =
    message.key.remoteJid;


  logger.info(
    `Native button clicked: ${id} JID: ${jid}`
  );


  /*
   * =========================
   * BACK
   * =========================
   */

  if (id === "menu_back") {

    const menuCommand =
      getCommand("menu");


    if (menuCommand) {

      await menuCommand.execute({

        sock,
        jid

      });

    }


    return true;
  }


  /*
   * =========================
   * CATEGORY
   * =========================
   */

  if (
    id.startsWith("menu_")
  ) {

    const category =
      id.replace(
        "menu_",
        ""
      );


    await sendCategoryMenu(

      sock,

      jid,

      category

    );


    return true;
  }


  /*
   * =========================
   * COMMAND
   * =========================
   */

  if (
    id.startsWith("cmd_")
  ) {

    const commandName =
      id.replace(
        "cmd_",
        ""
      );


    await executeButtonCommand(

      sock,

      message,

      commandName

    );


    return true;
  }


  return false;
}


/*
 * =========================
 * CATEGORY MENU
 * =========================
 */

async function sendCategoryMenu(
  sock,
  jid,
  category
) {

  const commands =
    getCommands()

      .filter(command => {

        if (!command.category) {
          return false;
        }


        return (
          command.category
            .toLowerCase() ===
          category.toLowerCase()
        );

      })

      .filter(command =>
        command.name !== "menu"
      );


  if (!commands.length) {

    await sock.sendMessage(

      jid,

      {

        text:
          `📂 ${category.toUpperCase()}\n\n` +
          "Belum ada command di kategori ini."

      }

    );


    return;
  }


  const buttons =
    commands.map(command => {

      let label =
        `⚡ ${command.name}`;


      if (
        command.name === "ping"
      ) {

        label = "🏓 Ping";

      }

      if (
        command.name === "owner"
      ) {

        label = "👑 Owner";

      }

      if (
        command.name === "admin"
      ) {

        label = "🛡️ Admin";

      }


      return createButton(

        label,

        `cmd_${command.name}`

      );

    });


  buttons.push(

    createButton(
      "↩️ Kembali",
      "menu_back"
    )

  );


  await sendNativeMenu(

    sock,

    jid,

    `📂 ${category.toUpperCase()}`,

    "Pilih command yang ingin dijalankan:",

    buttons

  );

}


/*
 * =========================
 * EXECUTE BUTTON COMMAND
 * =========================
 */

async function executeButtonCommand(
  sock,
  message,
  commandName
) {

  const command =
    getCommand(commandName);


  if (!command) {

    logger.warn(
      `Button command not found: ${commandName}`
    );


    await sock.sendMessage(

      message.key.remoteJid,

      {

        text:
          `❌ Command "${commandName}" tidak ditemukan.`

      }

    );


    return;
  }


  const data =
    normalizeMessage(message);


  if (!data) {

    await sock.sendMessage(

      message.key.remoteJid,

      {

        text:
          "❌ Data pesan tidak dapat diproses."

      }

    );


    return;
  }


  /*
   * =========================
   * IDENTITAS USER
   * =========================
   */

const sender =
  message.key?.participant ||
  data.sender ||
  message.key?.participantAlt ||
  null;

const senderAlt =
  message.key?.participantAlt ||
  message.key?.participant ||
  data.sender ||
  null;

data.sender = sender;
data.senderAlt = senderAlt;

logger.info(
  `[IDENTITY] sender=${sender}`
);

logger.info(
  `[IDENTITY] senderAlt=${senderAlt}`
);

  /*
   * =========================
   * PERMISSION CHECK
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
    `Permission result: ${permission.reason}`
  );


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

      `Button permission denied: ` +
      `${commandName} ` +
      `sender=${data.sender} ` +
      `reason=${permission.reason}`

    );


    return;
  }


  /*
   * =========================
   * EXECUTE
   * =========================
   */

  logger.command(
    commandName,
    data.jid
  );


  try {

    await command.execute({

      sock,

      ...data,

      name:
        commandName,

      args: [],

      raw:
        commandName

    });


    logger.info(
      `Button command executed: ${commandName}`
    );

  } catch (error) {

    logger.error(
      `Button command error: ${error.message}`
    );


    await sock.sendMessage(

      data.jid,

      {

        text:
          "❌ Terjadi kesalahan saat menjalankan command."

      }

    );

  }

}
