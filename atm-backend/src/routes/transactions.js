import { Router } from "express";
import { v4 as uuid } from "uuid";
import { auth } from "../middleware/auth.js";
import { accounts, round2, transactions } from "../services/db.js";

export const txRouter = Router();

const MAX_SINGLE_TX = 5000;
const WITHDRAW_DENOM = 20;

// POST /api/deposit
txRouter.post("/deposit", auth, (req, res) => {
  if (!req.pin) return res.status(401).json({ error: "Unauthorized" });

  const { amount } = req.body ?? {};
  const parsed = parseAmount(amount, { decimals: 2, max: MAX_SINGLE_TX });
  if (!parsed.ok) return res.status(400).json({ error: parsed.msg });

  const acct = accounts.get(req.pin);
  if (!acct) return res.status(404).json({ error: "Account not found" });

  const before = Number(acct.balance ?? 0);
  const after = round2(before + parsed.value);

  acct.balance = after;
  addTx(req.pin, "deposit", parsed.value, after);

  return res.json({ ok: true, balance: after });
});

// POST /api/withdraw
txRouter.post("/withdraw", auth, (req, res) => {
  if (!req.pin) return res.status(401).json({ error: "Unauthorized" });

  const { amount } = req.body ?? {};
  // Withdrawals: whole dollars, multiples of $20
  const parsed = parseAmount(amount, {
    decimals: 0,
    max: MAX_SINGLE_TX,
    multipleOf: WITHDRAW_DENOM,
  });
  if (!parsed.ok) return res.status(400).json({ error: parsed.msg });

  const acct = accounts.get(req.pin);
  if (!acct) return res.status(404).json({ error: "Account not found" });

  const before = Number(acct.balance ?? 0);
  if (parsed.value > before)
    return res.status(400).json({ error: "Insufficient funds" });

  const after = round2(before - parsed.value);

  acct.balance = after;
  addTx(req.pin, "withdraw", parsed.value, after);

  return res.json({ ok: true, balance: after });
});

// GET /api/transactions?limit=10
txRouter.get("/transactions", auth, (req, res) => {
  if (!req.pin) return res.status(401).json({ error: "Unauthorized" });

  const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
  const list = transactions.get(req.pin) || [];
  return res.json({ items: list.slice(0, limit) });
});

// ---- helpers ----
function addTx(pin, type, amount, balanceAfter) {
  const list = transactions.get(pin) || [];
  const entry = {
    id: uuid(),
    type, // "deposit" | "withdraw"
    amount: round2(amount),
    balanceAfter: round2(balanceAfter),
    at: new Date().toISOString(),
  };
  list.unshift(entry);
  if (list.length > 30) list.pop();
  transactions.set(pin, list);
  return entry;
}

/**
 * Parses and validates an amount.
 * @param {number|string} raw
 * @param {{decimals?:0|2, max?:number, multipleOf?:number}} opts
 */
function parseAmount(raw, opts = {}) {
  const { decimals = 2, max = MAX_SINGLE_TX, multipleOf } = opts;

  // coerce
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return { ok: false, msg: "Amount must be a number" };
  if (n <= 0) return { ok: false, msg: "Amount must be > 0" };
  if (n > max)
    return {
      ok: false,
      msg: `Amount exceeds single-transaction limit ($${max.toLocaleString()})`,
    };

  // precision
  const value = decimals === 0 ? Math.trunc(n) : round2(n); // 2-decimals via your helper

  if (decimals === 0 && !Number.isInteger(value)) {
    return { ok: false, msg: "Amount must be a whole dollar amount" };
  }

  if (multipleOf && value % multipleOf !== 0) {
    return {
      ok: false,
      msg: `Amount must be a multiple of ${multipleOf}`,
    };
  }

  return { ok: true, value };
}
