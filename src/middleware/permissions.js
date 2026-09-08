import {
  checkPermission as coreCheckPermission
} from "../core/permissions.js";


/*
 * =========================
 * CHECK PERMISSION
 * =========================
 */

export async function checkPermission(
  command,
  sender,
  senderAlt,
  sock,
  jid
) {

  return await coreCheckPermission(
    command,
    sender,
    senderAlt,
    sock,
    jid
  );

}


/*
 * =========================
 * REQUIRE PERMISSION
 * =========================
 */

export async function requirePermission(
  command,
  data,
  sock
) {

  return await checkPermission(
    command,
    data.sender,
    data.senderAlt,
    sock,
    data.jid
  );

}
