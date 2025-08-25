import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useATM } from "../../context/ATMContext";
import useScreenActions from "../../hooks/useScreenActions";
import useScreenError from "../../hooks/useScreenError";
import ScreenErrorOverlay from "../ScreenErrorOverlay";
import ATMInput from "../ATMInput";

const DENOM = 20;

export default function WithdrawScreen({ options = [40, 60, 100, 200] }) {
  const nav = useNavigate();
  const { withdraw, loading, balance } = useATM();
  const { error, showError, clearError } = useScreenError();

  // dollars available (assume number in context)
  const available = Number.isFinite(balance) ? balance : Infinity;

  const [otherMode, setOtherMode] = useState(false);
  const [other, setOther] = useState("");

  // parse integer dollars from the field
  const nOther = useMemo(() => {
    const n = parseInt(String(other ?? "").replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : NaN;
  }, [other]);

  const withinAvailable =
    available === Infinity || (Number.isFinite(nOther) && nOther <= available);

  const validOther =
    Number.isFinite(nOther) &&
    nOther > 0 &&
    nOther % DENOM === 0 &&
    withinAvailable;

  // Quick amounts: valid $20 multiples, within balance, up to four
  const quick = useMemo(
    () =>
      options
        .filter(
          (n) =>
            Number.isFinite(n) && n > 0 && n % DENOM === 0 && n <= available
        )
        .slice(0, 4),
    [options, available]
  );

  const back = useCallback(() => nav(-1), [nav]);

  const doWithdraw = useCallback(
    async (d) => {
      if (loading) return;
      clearError();
      try {
        await withdraw(d);
        setOtherMode(false);
        nav("/summary", {
          replace: true,
          state: { type: "withdrew", amount: d },
        });
      } catch (e) {
        showError(e);
      }
    },
    [withdraw, loading, nav, showError, clearError]
  );

  const enterOther = useCallback(() => {
    setOtherMode(true);
    setOther("");
    clearError();
  }, [clearError]);

  const cancelOther = useCallback(() => {
    setOtherMode(false);
    setOther("");
    clearError();
  }, [clearError]);

  const clearOther = useCallback(() => {
    setOther("");
    clearError();
  }, [clearError]);

  // Actions (loose list; useScreenActions packs to 8 slots)
  const actions = useMemo(() => {
    if (otherMode) {
      return [
        {
          side: "left",
          row: 3,
          label: "Back",
          onPress: cancelOther,
          disabled: loading,
        },
        {
          side: "right",
          row: 1,
          label: "Clear",
          onPress: clearOther,
          disabled: loading || !other,
        },
        {
          side: "right",
          row: 2,
          label: "Cancel",
          onPress: cancelOther,
          disabled: loading,
        },
        {
          side: "right",
          row: 3,
          label: "Confirm",
          onPress: () => doWithdraw(nOther),
          disabled: loading || !validOther,
        },
      ];
    }
    return [
      quick[0] && {
        side: "left",
        row: 0,
        label: `$${quick[0]}`,
        onPress: () => doWithdraw(quick[0]),
        disabled: loading,
      },
      quick[1] && {
        side: "left",
        row: 1,
        label: `$${quick[1]}`,
        onPress: () => doWithdraw(quick[1]),
        disabled: loading,
      },
      quick[2] && {
        side: "left",
        row: 2,
        label: `$${quick[2]}`,
        onPress: () => doWithdraw(quick[2]),
        disabled: loading,
      },
      { side: "left", row: 3, label: "Back", onPress: back, disabled: loading },
      quick[3] && {
        side: "right",
        row: 0,
        label: `$${quick[3]}`,
        onPress: () => doWithdraw(quick[3]),
        disabled: loading,
      },
      {
        side: "right",
        row: 2,
        label: "Other",
        onPress: enterOther,
        disabled: loading,
      },
    ].filter(Boolean);
  }, [
    otherMode,
    quick,
    loading,
    other,
    validOther,
    nOther,
    cancelOther,
    clearOther,
    doWithdraw,
    back,
    enterOther,
  ]);

  useScreenActions(actions, [
    otherMode,
    other,
    validOther,
    loading,
    quick.join(","),
  ]);

  return (
    <>
      <h3 className="h3Center">Withdraw</h3>
      {!otherMode && (
        <p className="pCenter">This machine only dispenses ${DENOM} bills</p>
      )}

      {otherMode && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
        >
          <ATMInput
            id="withdraw-other"
            label="Amount"
            kind="money"
            decimals={0}
            value={other}
            onChange={(v) => {
              setOther(String(v));
              if (error) clearError();
            }}
            onEnter={() => validOther && doWithdraw(nOther)}
            widthCh={6}
            autoFocus
          />
        </div>
      )}

      {!otherMode && quick.length === 0 && (
        <p className="helper" style={{ textAlign: "center", marginTop: 8 }}>
          No instant withdraws available.
        </p>
      )}

      {!validOther && otherMode && other && (
        <p className="helper" style={{ textAlign: "center", marginTop: 6 }}>
          Must be a multiple of ${DENOM}
          {available !== Infinity
            ? ` and less than $${available.toFixed(2)}`
            : ""}
          .
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
