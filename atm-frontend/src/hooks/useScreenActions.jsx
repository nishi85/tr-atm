import { useEffect, useMemo } from "react";
import { useActions, packActions } from "../context/actions";

// Build a stable signature from content (slot index, side/row, label, disabled)
const sigFrom = (arr) =>
  arr
    .map((a, i) =>
      a
        ? `${i}:${a.side[0]}${a.row}:${a.label ?? ""}:${a.disabled ? 1 : 0}`
        : `${i}:·`
    )
    .join("|");

export default function useScreenActions(list, deps = []) {
  const { setBase, clearBase } = useActions();

  const packed = useMemo(() => packActions(list), [list]);

  // Signature changes only when content (or your extra deps) change
  const depsSig = useMemo(() => deps.map((d) => String(d)).join("|"), [deps]);
  const sig = useMemo(
    () => `${sigFrom(packed)}||${depsSig}`,
    [packed, depsSig]
  );

  useEffect(() => {
    setBase(packed);
    return () => clearBase();
    // Run only when the signature changes (not on every new array identity)
  }, [sig, setBase, clearBase]);
}
