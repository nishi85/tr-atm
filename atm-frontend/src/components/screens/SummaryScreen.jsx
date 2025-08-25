import { useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useScreenActions from "../../hooks/useScreenActions";
import { useATM } from "../../context/ATMContext";

export default function SummaryScreen() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { balance, logout } = useATM();

  const txType = state?.type ?? "transaction";
  const amount = Number(state?.amount) || 0;

  const yes = useCallback(() => nav("/menu", { replace: true }), [nav]);
  const no = useCallback(async () => {
    nav("/take-card", { replace: true, state: { seconds: 4, doLogout: true } });
  }, [logout, nav]);

  const actions = useMemo(() => {
    const blank = (side, row) => ({
      side,
      row,
      label: "",
      onPress: () => {},
      disabled: true,
    });
    return [
      blank("left", 0),
      blank("left", 1),
      blank("left", 2),
      {
        side: "right",
        row: 3,
        label: "Back to Menu",
        onPress: yes,
        disabled: false,
      },

      blank("right", 0),
      blank("right", 1),
      {
        side: "right",
        row: 2,
        label: "Return Card",
        onPress: no,
        disabled: false,
      },
    ];
  }, [yes, no]);

  useScreenActions(actions, ["summary"]);

  return (
    <>
      <h3 className="h3Center">Transaction Complete</h3>
      {state ? (
        <p className="helper" style={{ textAlign: "center", marginTop: 8 }}>
          You {txType} ${Number.isFinite(amount) ? amount.toFixed(2) : "—"}.
        </p>
      ) : (
        <p className="helper" style={{ textAlign: "center", marginTop: 8 }}>
          Last transaction complete.
        </p>
      )}
      {Number.isFinite(balance) && (
        <p className="helper" style={{ textAlign: "center" }}>
          New balance: ${balance.toFixed(2)}
        </p>
      )}
    </>
  );
}
