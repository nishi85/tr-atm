import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useATM } from "../../context/ATMContext.jsx";
import useScreenActions from "../../hooks/useScreenActions";

export default function BalanceScreen() {
  const { balance, refreshBalance, loading } = useATM();
  const nav = useNavigate();

  const back = useCallback(() => nav("/menu"), [nav]);
  const refresh = useCallback(() => {
    if (!loading) refreshBalance();
  }, [loading, refreshBalance]);

  const actions = useMemo(
    () => [
      { side: "left", row: 3, label: "Back", onPress: back, disabled: false },
      {
        side: "right",
        row: 3,
        label: loading ? "Refreshing…" : "Refresh",
        onPress: refresh,
        disabled: loading,
      },
    ],
    [back, refresh, loading]
  );
  useScreenActions(actions);

  const displayBalance = Number.isFinite(balance) ? balance : 0;

  return (
    <div className="screenPrompt">
      <p>Current balance</p>
      <div className="balanceBox">
        $
        {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
