import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useATM } from "../../context/ATMContext";
import useScreenActions from "../../hooks/useScreenActions";
import useScreenError from "../../hooks/useScreenError";
import ScreenErrorOverlay from "../ScreenErrorOverlay";
import ATMInput from "../ATMInput";
import { parseMoney, formatMoney, MAX_SINGLE_TX } from "../../utils/money";

export default function DepositScreen() {
  const nav = useNavigate();
  const { deposit, loading } = useATM();
  const { error, showError, clearError } = useScreenError();

  const [amount, setAmount] = useState("");
  const n = useMemo(() => parseMoney(amount), [amount]);
  const valid = useMemo(
    () => Number.isFinite(n) && n > 0 && n <= MAX_SINGLE_TX,
    [n]
  );

  const back = useCallback(() => nav("/menu"), [nav]);

  const onConfirm = useCallback(async () => {
    if (!valid || loading) return;
    clearError();
    try {
      await deposit(n); // pass dollars; context converts
      nav("/summary", {
        replace: true,
        state: { type: "deposited", amount: n },
      });
    } catch (e) {
      showError(e);
    }
  }, [valid, loading, deposit, n, nav, showError, clearError]);

  const onClear = useCallback(() => {
    setAmount("0.00");
    clearError();
  }, [clearError]);
  const onCancel = useCallback(() => {
    clearError();
    back();
  }, [back, clearError]);

  const actions = useMemo(
    () => [
      { side: "left", row: 3, label: "Back", onPress: back, disabled: loading },
      {
        side: "right",
        row: 1,
        label: "Clear",
        onPress: onClear,
        disabled: loading || amount === "0.00",
      },
      {
        side: "right",
        row: 2,
        label: "Cancel",
        onPress: onCancel,
        disabled: loading,
      },
      {
        side: "right",
        row: 3,
        label: "Confirm",
        onPress: onConfirm,
        disabled: loading || !valid,
      },
    ],
    [back, onClear, onCancel, onConfirm, loading, amount, valid]
  );

  useScreenActions(actions, [amount, valid, loading]);

  return (
    <>
      <h3 className="h3Center">Deposit</h3>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <ATMInput
          id="deposit-amount"
          label="Amount"
          kind="money"
          decimals={2}
          value={amount}
          onChange={(v) => {
            setAmount(String(v));
            if (error) clearError();
          }}
          onBlur={() => setAmount(formatMoney(n))}
          onEnter={onConfirm}
          widthCh={8}
          autoFocus
        />
      </div>

      {!valid && amount !== "0.00" && (
        <p className="helper" style={{ textAlign: "center", marginTop: 6 }}>
          Enter a valid amount up to ${MAX_SINGLE_TX.toFixed(2)}.
        </p>
      )}

      {error && (
        <ScreenErrorOverlay
          message={error}
          onOk={clearError}
          okLabel="OK"
          slot={{ side: "right", row: 3 }}
        />
      )}
    </>
  );
}
