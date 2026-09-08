import {
  proto,
  generateWAMessageFromContent
} from "@whiskeysockets/baileys";

function buildBizNode() {
  const privacyModeTs =
    Math.floor(Date.now() / 1000) - 77980457;

  return {
    tag: "biz",

    attrs: {
      actual_actors: "2",
      host_storage: "2",
      privacy_mode_ts: String(privacyModeTs)
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

export default {
  name: "menu",

  aliases: ["help"],

  description: "Menampilkan native menu axybot",

  category: "general",

  usage: "menu",

  premium: false,

  async execute({ sock, jid }) {

    const buttons = [
      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "⚡ General",
            id: "menu_general"
          })
        }),

      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "🛠️ Tools",
            id: "menu_tools"
          })
        }),

      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "👑 Owner",
            id: "menu_owner"
          })
        }),

      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "🛡️ Admin",
            id: "menu_admin"
          })
        }),

      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "⭐ Premium",
            id: "menu_premium"
          })
        }),

      proto.Message.InteractiveMessage
        .NativeFlowMessage.NativeFlowButton.create({
          name: "quick_reply",

          buttonParamsJson: JSON.stringify({
            display_text: "🧩 Plugins",
            id: "menu_plugins"
          })
        })
    ];

    const interactiveMessage =
      proto.Message.InteractiveMessage.create({

        header:
          proto.Message.InteractiveMessage.Header.create({
            title: "🤖 AX YBOT",
            subtitle: "CORE V5",
            hasMediaAttachment: false
          }),

        body:
          proto.Message.InteractiveMessage.Body.create({
            text:
              "Selamat datang di axybot.\n\n" +
              "Pilih kategori menu:"
          }),

        footer:
          proto.Message.InteractiveMessage.Footer.create({
            text: "axybot Core V5"
          }),

        nativeFlowMessage:
          proto.Message.InteractiveMessage
            .NativeFlowMessage.create({

              buttons,

              messageParamsJson: "{}",

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
                deviceListMetadataVersion: 2
              },

              interactiveMessage
            }
          }
        },

        {
          userJid: sock.user.id
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
        messageId: message.key.id,
        additionalNodes
      }
    );
  }
};
