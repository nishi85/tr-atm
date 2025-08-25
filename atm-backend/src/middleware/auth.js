import { sessions } from "../services/db.js";

export function auth(req, res, next) {
  try {
    const header = req.get("authorization") || "";

    const token = req.cookies?.session;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const sess = sessions.get(token);
    if (!sess) return res.status(401).json({ error: "Unauthorized" });

    if (sess.expiresAt && sess.expiresAt <= Date.now()) {
      sessions.delete(token);
      return res.status(401).json({ error: "Session expired" });
    }

    req.pin = sess.pin;
    req.session = sess;
    return next();
  } catch (err) {
    return next(err);
  }
}
