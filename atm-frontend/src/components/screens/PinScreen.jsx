import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useATM } from "../../context/ATMContext";
import useScreenActions from "../../hooks/useScreenActions";
import useScreenError from "../../hooks/useScreenError";
import ScreenErrorOverlay from "../ScreenErrorOverlay";
import ATMInput from "../ATMInput";

export default function PinScreen() {
  const { enterPin, loading } = useATM();
  const { error, showError, clearError } = useScreenError();
  const nav = useNavigate();

  const [value, setValue] = useState("");

  // keep latest PIN without changing handler identity (sync during render)
  const pinRef = useRef("");
  pinRef.current = value;

  const submitting = useRef(false);

  const exit = useCallback(() => {
    // Navigate immediately; (no session yet, but doLogout is harmless)
    nav("/take-card", { replace: true, state: { seconds: 4, doLogout: true } });
  }, [nav]);

  const clear = useCallback(() => setValue(""), []);

  const confirm = useCallback(async () => {
    const pin = pinRef.current;
    if (submitting.current || loading) return;
    try {
      await enterPin(pin); // throws on error
      nav("/menu", { replace: true }); // success → menu
    } catch (e) {
      showError(e);
    } finally {
      submitting.current = false;
    }
  }, [enterPin, loading, nav, showError]);

  const actions = useMemo(() => {
    const blank = (side, row) => ({
      side,
      row,
      label: "",
      onPress: () => {},
      disabled: true,
    });

    // If an error overlay is visible, yield all slots so the overlay can own them.
    if (error) {
      return [
        blank("left", 0),
        blank("left", 1),
        blank("left", 2),
        blank("left", 3),
        blank("right", 0),
        blank("right", 1),
        blank("right", 2),
        blank("right", 3),
      ];
    }

    const canConfirm = !loading && value.length >= 4;
    return [
      blank("left", 0),
      blank("left", 1),
      blank("left", 2),
      { side: "left", row: 3, label: "Exit", onPress: exit, disabled: false },
      blank("right", 0),
      {
        side: "right",
        row: 1,
        label: "Clear",
        onPress: clear,
        disabled: loading || !value,
      },
      {
        side: "right",
        row: 2,
        label: "Cancel",
        onPress: exit,
        disabled: false,
      },
      {
        side: "right",
        row: 3,
        label: "Confirm",
        onPress: confirm,
        disabled: !canConfirm,
      },
    ];
  }, [error, exit, clear, confirm, loading, value]);

  // use a stable signature so the hook doesn't thrash
  const signature = useMemo(
    () => `pin|len:${value.length}|ld:${loading ? 1 : 0}|err:${error ? 1 : 0}`,
    [value.length, loading, error]
  );

  useScreenActions(actions, [signature]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <h3 className="h3Center">Enter PIN</h3>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <ATMInput
          id="pin"
          label="PIN:"
          kind="pin"
          length={4}
          value={value}
          onChange={(v) => setValue(v)}
          onEnter={confirm}
          widthCh={6}
          autoFocus
        />
      </div>

      {error && (
        <ScreenErrorOverlay message={error} onOk={clearError} okLabel="OK" />
      )}
    </div>
  );
}
