import { Router } from "express";
import { v4 as uuid } from "uuid";
import { accounts, sessions, round2 } from "../services/db.js";

export const authRouter = Router();
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS ?? 60 * 60 * 1000);

authRouter.post("/login", (req, res) => {
  const { pin } = req.body || {};

  if (typeof pin !== "string" || !/^\d{4,6}$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4–6 digits" });
  }

  const acct = accounts.get(pin);
  if (!acct) {
    return res.status(401).json({ error: "Invalid PIN" });
  }

  const token = uuid();
  sessions.set(token, {
    pin,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only on HTTPS
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });

  return res.json({
    session: { holder: acct.holder, cardType: acct.cardType },
    balance: round2(acct.balance ?? 0),
  });
});

authRouter.post("/logout", (req, res) => {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  const cookieToken = req.cookies?.session;
  const token = cookieToken || bearer;
  if (token) sessions.delete(token);
  res.clearCookie("session", { path: "/" });
  res.status(204).end();
});
