import "dotenv/config";

/*
 * =========================
 * NORMALIZE ID
 * =========================
 */

function normalizeId(id) {
  if (!id) return null;

  return String(id)
    .trim()
    .replace(/:\d+(?=@)/, "")
    .toLowerCase();
}


/*
 * =========================
 * OWNER IDS
 * =========================
 */

function getOwnerIds() {
  const ids = [];

  if (process.env.OWNER_NUMBER) {
    const number =
      process.env.OWNER_NUMBER
        .replace(/\D/g, "");

    if (number) {
      ids.push(
        `${number}@s.whatsapp.net`
      );
    }
  }

  if (process.env.OWNER_LID) {
    ids.push(
      process.env.OWNER_LID
    );
  }

  return ids
    .map(normalizeId)
    .filter(Boolean);
}


/*
 * =========================
 * OWNER CHECK
 * =========================
 */

export function isOwner(
  sender,
  senderAlt = null
) {
  const ownerIds =
    getOwnerIds();

  const candidates = [
    sender,
    senderAlt
  ]
    .map(normalizeId)
    .filter(Boolean);

  return candidates.some(
    id => ownerIds.includes(id)
  );
}


/*
 * =========================
 * ADMIN CHECK
 * =========================
 */

export async function isGroupAdmin(
  sock,
  jid,
  sender,
  senderAlt = null
) {
  if (!jid?.endsWith("@g.us")) {
    return false;
  }

  try {
    const metadata =
      await sock.groupMetadata(jid);

    const participants =
      metadata?.participants || [];

    const candidates = [
      sender,
      senderAlt
    ]
      .map(normalizeId)
      .filter(Boolean);

    for (const participant of participants) {

      const participantIds = [
        participant.id,
        participant.jid,
        participant.lid,
        participant.phoneNumber
      ]
        .map(normalizeId)
        .filter(Boolean);

      const matched =
        candidates.some(
          candidate =>
            participantIds.includes(candidate)
        );

      if (!matched) {
        continue;
      }

      const admin =
        participant.admin;

      if (
        admin === "admin" ||
        admin === "superadmin"
      ) {
        return true;
      }
    }

    return false;

  } catch (error) {

    console.error(
      "[PERMISSION] Group metadata error:",
      error.message
    );

    return false;
  }
}


/*
 * =========================
 * PERMISSION ENGINE
 * =========================
 */

export async function checkPermission(
  command,
  sender,
  senderAlt,
  sock,
  jid
) {

  if (!command) {
    return {
      allowed: false,
      reason: "command_not_found"
    };
  }


  /*
   * OWNER = FULL ACCESS
   */

  if (
    isOwner(
      sender,
      senderAlt
    )
  ) {

    return {
      allowed: true,
      reason: "owner"
    };

  }


  /*
   * OWNER ONLY
   */

  if (
    command.ownerOnly === true
  ) {

    return {
      allowed: false,
      reason: "owner_only"
    };

  }


  /*
   * ADMIN ONLY
   */

  if (
    command.adminOnly === true
  ) {

    const admin =
      await isGroupAdmin(
        sock,
        jid,
        sender,
        senderAlt
      );

    if (!admin) {

      return {
        allowed: false,
        reason: "admin_only"
      };

    }

    return {
      allowed: true,
      reason: "admin"
    };

  }


  /*
   * PREMIUM
   */

  if (
    command.premium === true
  ) {

    return {
      allowed: false,
      reason: "premium_only"
    };

  }


  /*
   * PUBLIC
   */

  return {
    allowed: true,
    reason: null
  };
}
