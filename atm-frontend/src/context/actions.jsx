import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const ActionsCtx = createContext(null);
export const useActions = () => useContext(ActionsCtx);

export function ActionsProvider({ children }) {
  const [base, setBase] = useState(Array(8).fill(null));
  const [overlay, setOverlay] = useState(null);

  const clearBase = useCallback(() => setBase(Array(8).fill(null)), []);
  const clearOverlay = useCallback(() => setOverlay(null), []);

  const actions = overlay ?? base;

  const value = useMemo(
    () => ({
      actions,
      setBase,
      clearBase,
      setOverlay,
      clearOverlay,
      setActions: setBase,
      clearActions: clearBase,
    }),
    [actions, setBase, clearBase, setOverlay, clearOverlay]
  );

  return <ActionsCtx.Provider value={value}>{children}</ActionsCtx.Provider>;
}

export function packActions(list = []) {
  const out = Array(8).fill(null);
  for (const a of list || []) {
    if (!a) continue;
    const side = a.side === "right" ? "right" : "left";
    const row = Math.min(3, Math.max(0, Number(a.row)));
    const idx = side === "right" ? 4 + row : row;
    out[idx] = { ...a, side, row, onPress: a.onPress ?? a.onClick };
  }
  return out;
}
