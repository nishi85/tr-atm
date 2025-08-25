import useOverlayActions from "../hooks/useOverlayActions";
import cls from "./ScreenErrorOverlay.module.css";

export default function ScreenErrorOverlay({
  message,
  onOk,
  okLabel = "OK",
  slot = { side: "right", row: 3 },
  style,
}) {
  // publish hardware OK slot
  useOverlayActions(
    [
      {
        side: slot.side,
        row: slot.row,
        label: okLabel,
        onPress: onOk,
        disabled: false,
      },
    ],
    [slot.side, slot.row, okLabel, onOk, message]
  );

  return (
    <div className={cls.overlay} style={style}>
      <div className={cls.card}>
        <h4 className={cls.title}>Error</h4>
        <p>{String(message || "Something went wrong")}</p>

        <button type="button" className={cls.ok} onClick={onOk}>
          {okLabel}
        </button>

        <p className={cls.hint}>
          You can also press the <strong>{okLabel}</strong> side button.
        </p>
      </div>
    </div>
  );
}
