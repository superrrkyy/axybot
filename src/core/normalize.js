export function normalizeMessage(message) {

  const jid =
    message?.key?.remoteJid;


  if (!jid) {
    return null;
  }


  const isGroup =
    jid.endsWith("@g.us");


  const isPrivate =
    !isGroup;


  let text = "";


  const msg =
    message.message;


  if (msg?.conversation) {

    text =
      msg.conversation;

  }

  else if (
    msg?.extendedTextMessage?.text
  ) {

    text =
      msg.extendedTextMessage.text;

  }

  else if (
    msg?.imageMessage?.caption
  ) {

    text =
      msg.imageMessage.caption;

  }

  else if (
    msg?.videoMessage?.caption
  ) {

    text =
      msg.videoMessage.caption;

  }


  text =
    text.trim();

return {
  jid,

  isGroup,

  isPrivate,

  sender:
    message.key?.participant ||
    message.key?.participantAlt ||
    jid,

  senderAlt:
    message.key?.participantAlt ||
    message.key?.participant ||
    null,

  pushName:
    message.pushName ||
    "User",

  text,

  message
 };


}
