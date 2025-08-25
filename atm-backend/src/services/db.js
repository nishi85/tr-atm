// dummy data
const SEED_ACCOUNTS = [
  ["1111", { holder: "Peter Parker", cardType: "visa", balance: 820.15 }],
  ["2222", { holder: "Sam Park", cardType: "mastercard", balance: 1250.0 }],
  ["3333", { holder: "Jamie Wu", cardType: "star", balance: 430.44 }],
  ["4444", { holder: "Taylor Li", cardType: "interac", balance: 199.9 }],
  ["5555", { holder: "Taylor Li", cardType: "maestro", balance: 0.0 }],
  ["6666", { holder: "Taylor Li", cardType: "pulse", balance: 200.0 }],
];

export let accounts = new Map(SEED_ACCOUNTS);
// session token -> pin
export let sessions = new Map();
// pin -> array of transactions (most recent first)
export let transactions = new Map(SEED_ACCOUNTS.map(([pin]) => [pin, []]));

// helper functionS
export function round2(n) {
  return Math.round(n * 100) / 100;
}

// test helper: restore all in-memory state
export function resetDb() {
  accounts = new Map(SEED_ACCOUNTS.map(([pin, acct]) => [pin, { ...acct }]));
  sessions = new Map();
  transactions = new Map(SEED_ACCOUNTS.map(([pin]) => [pin, []]));
}

export function purgeExpiredSessions() {
  const now = Date.now();
  let removed = 0;
  for (const [token, value] of sessions) {
    if (
      typeof value === "object" &&
      value?.expiresAt &&
      value.expiresAt <= now
    ) {
      sessions.delete(token);
      removed++;
    }
  }
  if (removed) console.log(`[sessions] purged ${removed} expired`);
}
