import { db } from "../database/sqlite.js";

function now() {
  return Date.now();
}

export function getUser(id) {
  const statement = db.prepare(`
    SELECT *
    FROM users
    WHERE id = ?
  `);

  return statement.get(id);
}

export function createUser(
  id,
  name = "User"
) {
  const timestamp = now();

  const statement = db.prepare(`
    INSERT INTO users (
      id,
      name,
      level,
      xp,
      coin,
      premium,
      premium_expired_at,
      created_at,
      updated_at
    )
    VALUES (?, ?, 1, 0, 0, 0, NULL, ?, ?)
  `);

  statement.run(
    id,
    name || "User",
    timestamp,
    timestamp
  );

  return getUser(id);
}

export function getOrCreateUser(
  id,
  name = "User"
) {
  const existing =
    getUser(id);

  if (existing) {
    return existing;
  }

  return createUser(
    id,
    name
  );
}

export function updateUser(
  id,
  data = {}
) {
  const user =
    getUser(id);

  if (!user) {
    return null;
  }

  const allowedFields = [
    "name",
    "level",
    "xp",
    "coin",
    "premium",
    "premium_expired_at"
  ];

  const fields = [];
  const values = [];

  for (const field of allowedFields) {

    if (
      Object.prototype.hasOwnProperty.call(
        data,
        field
      )
    ) {
      fields.push(
        `${field} = ?`
      );

      values.push(
        data[field]
      );
    }
  }

  if (!fields.length) {
    return user;
  }

  fields.push(
    "updated_at = ?"
  );

  values.push(now());
  values.push(id);

  const statement =
    db.prepare(`
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
    `);

  statement.run(...values);

  return getUser(id);
}

export function addXP(
  id,
  amount
) {
  const user =
    getUser(id);

  if (!user) {
    return null;
  }

  return updateUser(id, {
    xp: user.xp + amount
  });
}

export function addCoin(
  id,
  amount
) {
  const user =
    getUser(id);

  if (!user) {
    return null;
  }

  return updateUser(id, {
    coin: user.coin + amount
  });
}

export function setPremium(
  id,
  expiredAt
) {
  return updateUser(id, {
    premium: 1,
    premium_expired_at:
      expiredAt
  });
}

export function removePremium(id) {
  return updateUser(id, {
    premium: 0,
    premium_expired_at: null
  });
}
