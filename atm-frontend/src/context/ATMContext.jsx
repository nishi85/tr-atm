// src/context/ATMContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { atmApi } from "../api/atmApi";
import { MAX_SINGLE_TX } from "../utils/money";

const ATMContext = createContext(null);
export const useATM = () => useContext(ATMContext);

// small helper to coerce to number safely
const toNum = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
};

export function ATMProvider({ children }) {
  // Full session from backend (null when logged out)
  const [session, setSession] = useState(null); // e.g. { holder, cardType }
  // Balance is kept separate for frequent reads/updates
  const [balance, setBalance] = useState(0);
  // Pre-PIN card choice (UI-only)
  const [cardType, setCardType] = useState(null);
  // Simple global loading flag for UX
  const [loading, setLoading] = useState(false);

  // Reset all session-related state
  const resetSession = useCallback(() => {
    setSession(null);
    setBalance(null);
    setCardType(null);
  }, []);

  // ---- API actions (resolve on success, throw on error) ----

  const enterPin = useCallback(async (pin) => {
    if (typeof pin !== "string" || !/^\d{4,6}$/.test(pin)) {
      throw new Error("PIN must be 4–6 digits");
    }
    setLoading(true);
    try {
      const res = await atmApi.loginWithPin(pin); // { session, balance }
      const nextSession = res?.session ?? null;

      setSession(nextSession);
      if (typeof res?.balance === "number") setBalance(res.balance);
      if (nextSession?.cardType) setCardType(nextSession.cardType);

      return nextSession;
    } catch (e) {
      const msg = e?.data?.error || e?.message || "Login failed";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await atmApi.getBalance(); // { balance }
      if (typeof res?.balance === "number") setBalance(res.balance);
      return res;
    } catch (e) {
      const msg = e?.data?.error || e?.message || "Could not fetch balance";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = useCallback(async (dollars) => {
    const amt = toNum(dollars);
    if (!Number.isFinite(amt) || amt <= 0) throw new Error("Invalid amount");
    if (amt > MAX_SINGLE_TX) {
      throw new Error(
        `Amount exceeds single-transaction limit ($${MAX_SINGLE_TX.toLocaleString()})`
      );
    }

    setLoading(true);
    try {
      // Send dollars straight-through
      const res = await atmApi.deposit(amt); // expect { balance? }
      const srv = toNum(res?.balance);
      if (Number.isFinite(srv)) {
        setBalance(srv);
      } else {
        // derive locally if server didn't echo balance
        setBalance((prev) => {
          const p = toNum(prev);
          return Number.isFinite(p) ? p + amt : amt;
        });
      }
      return res;
    } catch (e) {
      const msg = e?.data?.error || e?.message || "Deposit failed";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const withdraw = useCallback(async (dollars) => {
    const amt = toNum(dollars);
    if (!Number.isFinite(amt) || amt <= 0) throw new Error("Invalid amount");
    if (amt > MAX_SINGLE_TX) {
      throw new Error(
        `Amount exceeds single-transaction limit ($${MAX_SINGLE_TX.toLocaleString()})`
      );
    }

    setLoading(true);
    try {
      // Send dollars straight-through
      const res = await atmApi.withdraw(amt); // expect { balance? }
      const srv = toNum(res?.balance);
      if (Number.isFinite(srv)) {
        setBalance(srv);
      } else {
        // derive locally if server didn't echo balance
        setBalance((prev) => {
          const p = toNum(prev);
          if (!Number.isFinite(p)) return 0;
          const next = p - amt;
          return next < 0 ? 0 : next;
        });
      }
      return res;
    } catch (e) {
      const msg = e?.data?.error || e?.message || "Withdrawal failed";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Best-effort: don't throw, so callers (e.g., TakeCard screen) don't need try/catch
  const logout = useCallback(async () => {
    try {
      await atmApi.logout();
    } catch {
      // ignore logout errors
    } finally {
      resetSession();
      setLoading(false);
    }
  }, [resetSession]);

  // Derived convenience values (not stored)
  const name = session?.holder ?? session?.name ?? "";
  const isAuthed = !!session;

  const value = useMemo(
    () => ({
      // state
      session,
      balance,
      cardType,
      loading,
      isAuthed,
      // actions
      enterPin,
      refreshBalance,
      withdraw,
      deposit,
      logout,
      chooseCardType: setCardType,
      // convenience
      name,
    }),
    [
      session,
      balance,
      cardType,
      loading,
      isAuthed,
      enterPin,
      refreshBalance,
      withdraw,
      deposit,
      logout,
      name,
    ]
  );

  return <ATMContext.Provider value={value}>{children}</ATMContext.Provider>;
}
