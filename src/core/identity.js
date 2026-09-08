/*
 * =========================
 * AX YBOT CORE V5
 * IDENTITY RESOLVER
 * =========================
 */

function clean(value) {
  if (!value) {
    return null;
  }

  return String(value).trim();
}


/*
 * Ambil semua kemungkinan identitas user
 */

export function getSenderIdentities(
  message,
  data = {}
) {

  const identities = [

    message?.key?.participant,

    message?.key?.participantAlt,

    data?.sender,

    data?.senderAlt

  ]
    .filter(Boolean)
    .map(clean);


  return [
    ...new Set(identities)
  ];
}


/*
 * Cocokkan dua identitas
 *
 * Contoh:
 * 628xxx@s.whatsapp.net
 * 628xxx@c.us
 */

export function sameIdentity(
  a,
  b
) {

  if (!a || !b) {
    return false;
  }


  a = clean(a);
  b = clean(b);


  if (a === b) {
    return true;
  }


  const numberA =
    a.split("@")[0];

  const numberB =
    b.split("@")[0];


  return (
    numberA &&
    numberB &&
    numberA === numberB
  );
}


/*
 * Cocokkan array identitas
 */

export function hasIdentity(
  identities,
  target
) {

  if (!target) {
    return false;
  }


  return identities.some(
    identity =>
      sameIdentity(
        identity,
        target
      )
  );
}
