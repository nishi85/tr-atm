import { useId } from "react";
import classes from "./ATMInput.module.css";

export default function ATMInput({
  id,
  label,
  kind = "text", // "pin" | "money" | "text"
  value = "",
  onChange,
  onEnter,
  length, // for pin
  decimals = 2, // for money
  autoFocus = true,
  color = "#fff",
  onPaste,
  readOnly,
  widthCh = 7, // controls field width (in ch)
  className = "", // extra input class
  labelClassName = "", // extra label class
  containerClassName = "",
  style,
}) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const sanitize = (s) => {
    if (kind === "pin") return s.replace(/\D/g, "").slice(0, length ?? 4);
    if (kind === "money") {
      s = s.replace(",", ".").replace(/[^\d.]/g, "");
      const [i = "", f] = s.split(".");
      return f !== undefined ? `${i}.${(f || "").slice(0, decimals)}` : i;
    }
    return s;
  };

  const cssVars = {
    ...(color ? { "--atm-color": color } : null),
    ...(widthCh ? { "--width": `${widthCh}ch` } : null),
    ...style,
  };

  return (
    <div
      className={[classes.row, containerClassName].filter(Boolean).join(" ")}
      style={cssVars}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={[classes.label, labelClassName].filter(Boolean).join(" ")}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[classes.field, className].filter(Boolean).join(" ")}
        type={kind === "pin" ? "password" : "text"}
        inputMode={
          kind === "money" ? "decimal" : kind === "pin" ? "numeric" : "text"
        }
        maxLength={kind === "pin" ? (length ?? 4) : undefined}
        value={value}
        onChange={(e) => onChange?.(sanitize(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter?.(value);
        }}
        autoFocus={autoFocus}
        autoComplete="off"
        onPaste={onPaste}
        readOnly={readOnly}
      />
    </div>
  );
}
