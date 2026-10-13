/**
 * Unit test untuk inti axybot (tanpa koneksi WhatsApp).
 * Jalankan: npm test   (node --test)
 */
import test from "node:test";
import assert from "node:assert/strict";

import { normalizeMessage } from "../src/core/normalize.js";
import { getSenderIdentities, sameIdentity, hasIdentity } from "../src/core/identity.js";

const groupMsg = (over = {}) => ({
  key: {
    remoteJid: "12345-67890@g.us",
    participant: "628111222333@s.whatsapp.net",
    participantAlt: "628111222333@lid",
    ...over.key,
  },
  pushName: "Budi",
  message: { conversation: "halo bot" },
  ...over,
});

test("normalizeMessage: pesan grup terdeteksi sebagai grup", () => {
  const m = normalizeMessage(groupMsg());
  assert.equal(m.isGroup, true);
  assert.equal(m.isPrivate, false);
  assert.equal(m.jid, "12345-67890@g.us");
  assert.equal(m.text, "halo bot");
  assert.equal(m.pushName, "Budi");
});

test("normalizeMessage: chat pribadi terdeteksi sebagai privat", () => {
  const m = normalizeMessage(
    groupMsg({ key: { remoteJid: "628999888777@s.whatsapp.net" }, message: { conversation: "hai" } }),
  );
  assert.equal(m.isPrivate, true);
  assert.equal(m.isGroup, false);
});

test("normalizeMessage: mengambil teks dari berbagai jenis pesan", () => {
  const base = { key: { remoteJid: "628@s.whatsapp.net" } };
  assert.equal(normalizeMessage({ ...base, message: { extendedTextMessage: { text: "teks panjang" } } }).text, "teks panjang");
  assert.equal(normalizeMessage({ ...base, message: { imageMessage: { caption: "caption foto" } } }).text, "caption foto");
  assert.equal(normalizeMessage({ ...base, message: { videoMessage: { caption: "caption video" } } }).text, "caption video");
});

test("normalizeMessage: pesan tanpa teks tetap aman (string kosong)", () => {
  const m = normalizeMessage({ key: { remoteJid: "628@s.whatsapp.net" }, message: {} });
  assert.equal(m.text, "");
});

test("normalizeMessage: tanpa remoteJid → null (bukan error)", () => {
  assert.equal(normalizeMessage({ key: {}, message: {} }), null);
  assert.equal(normalizeMessage(null), null);
  assert.equal(normalizeMessage(undefined), null);
});

test("normalizeMessage: sender & senderAlt diisi dengan cadangan yang benar", () => {
  const m = normalizeMessage(groupMsg());
  assert.equal(m.sender, "628111222333@s.whatsapp.net");
  assert.equal(m.senderAlt, "628111222333@lid");

  const noParticipant = normalizeMessage({
    key: { remoteJid: "628777666555@s.whatsapp.net" },
    message: { conversation: "x" },
  });
  assert.equal(noParticipant.sender, "628777666555@s.whatsapp.net");
  assert.equal(noParticipant.senderAlt, null);
});

test("normalizeMessage: pushName kosong diganti 'User'", () => {
  const m = normalizeMessage({
    key: { remoteJid: "628@s.whatsapp.net" },
    message: { conversation: "x" },
  });
  assert.equal(m.pushName, "User");
});

test("normalizeMessage: teks dipangkas spasi berlebih", () => {
  const m = normalizeMessage(groupMsg({ message: { conversation: "   spasi   " } }));
  assert.equal(m.text, "spasi");
});

test("getSenderIdentities: mengumpulkan identitas unik", () => {
  const ids = getSenderIdentities(groupMsg(), {});
  assert.deepEqual(ids, ["628111222333@s.whatsapp.net", "628111222333@lid"]);
});

test("getSenderIdentities: menghapus duplikat dari data tambahan", () => {
  const ids = getSenderIdentities(groupMsg(), {
    sender: "628111222333@s.whatsapp.net",
    senderAlt: "628111222333@lid",
  });
  assert.equal(ids.length, 2);
});

test("sameIdentity: nomor sama dengan domain berbeda dianggap sama", () => {
  assert.equal(sameIdentity("628111222333@s.whatsapp.net", "628111222333@c.us"), true);
  assert.equal(sameIdentity("628111222333@lid", "628111222333@s.whatsapp.net"), true);
  assert.equal(sameIdentity("628111222333@s.whatsapp.net", "628999000111@s.whatsapp.net"), false);
  assert.equal(sameIdentity(null, "628@s.whatsapp.net"), false);
  assert.equal(sameIdentity("628@s.whatsapp.net", undefined), false);
});

test("hasIdentity: mencocokkan target di dalam daftar identitas", () => {
  const ids = ["628111222333@s.whatsapp.net", "628111222333@lid"];
  assert.equal(hasIdentity(ids, "628111222333@c.us"), true);
  assert.equal(hasIdentity(ids, "628000@c.us"), false);
  assert.equal(hasIdentity(ids, null), false);
});
