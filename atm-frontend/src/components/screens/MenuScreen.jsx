import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useATM } from "../../context/ATMContext";
import useScreenActions from "../../hooks/useScreenActions";

export default function MenuScreen() {
  const nav = useNavigate();
  const { loading, session } = useATM();

  const goWithdraw = useCallback(() => nav("/withdraw"), [nav]);
  const goDeposit = useCallback(() => nav("/deposit"), [nav]);
  const goBalance = useCallback(() => nav("/balance"), [nav]);
  const reenterPin = useCallback(() => nav("/pin"), [nav]);
  const exit = useCallback(
    () =>
      nav("/take-card", {
        replace: true,
        state: { seconds: 4, doLogout: true },
      }),
    [nav]
  );

  useScreenActions(
    useMemo(
      () => [
        {
          side: "left",
          row: 2,
          label: "Withdraw",
          onPress: goWithdraw,
          disabled: loading,
        },
        {
          side: "left",
          row: 3,
          label: "Deposit",
          onPress: goDeposit,
          disabled: loading,
        },
        {
          side: "right",
          row: 2,
          label: "Balance",
          onPress: goBalance,
          disabled: loading,
        },
        { side: "right", row: 1, label: "Exit", onPress: exit },
        {
          side: "right",
          row: 3,
          label: "Re-Enter PIN",
          onPress: reenterPin,
          disabled: loading,
        },
      ],
      [goWithdraw, goDeposit, goBalance, reenterPin, exit, loading]
    )
  );

  const displayName = session?.holder || "User";
  return (
    <div className="screenPrompt">
      <p>Hi {displayName}!</p>
      <p>Please make a choice…</p>
    </div>
  );
}
