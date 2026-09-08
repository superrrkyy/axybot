import {
  getOrCreateUser
} from "./manager.js";

export function ensureUser(data) {

  const id =
    data.sender ||
    data.jid;

  const name =
    data.pushName ||
    "User";

  if (!id) {
    return null;
  }

  return getOrCreateUser(
    id,
    name
  );
}
