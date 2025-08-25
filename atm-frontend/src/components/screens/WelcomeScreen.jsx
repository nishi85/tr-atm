// src/components/screens/WelcomeScreen.jsx
import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useScreenActions from "../../hooks/useScreenActions";

export default function WelcomeScreen() {
  const nav = useNavigate();
  const goPin = useCallback(() => nav("/pin"), [nav]);

  const actions = useMemo(
    () => [
      {
        side: "right",
        row: 3,
        label: "Enter PIN",
        onPress: goPin,
        disabled: false,
      },
    ],
    [goPin]
  );

  // minimal deps to avoid loops
  useScreenActions(actions, ["welcome"]);

  return (
    <>
      <h3 className="h3Center">Welcome to the ATM</h3>
    </>
  );
}
