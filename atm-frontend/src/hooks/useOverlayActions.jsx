import { useEffect, useMemo } from "react";
import { useActions, packActions } from "../context/actions";

const sigFrom = (arr) =>
  arr
    .map((a, i) =>
      a
        ? `${i}:${a.side[0]}${a.row}:${a.label ?? ""}:${a.disabled ? 1 : 0}`
        : `${i}:·`
    )
    .join("|");

export default function useOverlayActions(list, deps = []) {
  const { setOverlay, clearOverlay } = useActions();
  const packed = useMemo(() => packActions(list), [list]);
  const depsSig = useMemo(() => deps.map((d) => String(d)).join("|"), [deps]);
  const sig = useMemo(
    () => `${sigFrom(packed)}||${depsSig}`,
    [packed, depsSig]
  );

  useEffect(() => {
    setOverlay(packed);
    return () => clearOverlay();
  }, [sig, setOverlay, clearOverlay]);
}
