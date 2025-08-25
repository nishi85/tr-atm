// src/components/screens/TakeCardScreen.jsx
import { useEffect, useMemo, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useScreenActions from "../../hooks/useScreenActions";
import { useATM } from "../../context/ATMContext";

export default function TakeCardScreen({ defaultSeconds = 4, to = "/" }) {
  const nav = useNavigate();
  const { state } = useLocation();
  const { logout } = useATM();
  const total = Math.max(1, Number(state?.seconds ?? defaultSeconds));
  const [left, setLeft] = useState(total);

  // Optional logout: fire once, but DON'T block navigation
  useEffect(() => {
    if (state?.doLogout) {
      // fire and forget
      Promise.resolve()
        .then(() => logout?.())
        .catch(() => {});
    }
  }, []); // run once

  useEffect(() => {
    const tick = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    const timer = setTimeout(() => nav(to, { replace: true }), total * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [nav, to, total]);

  const blank = useCallback(
    (side, row) => ({
      side,
      row,
      label: "",
      onPress: () => {},
      disabled: true,
    }),
    []
  );
  const actions = useMemo(
    () => [
      blank("left", 0),
      blank("left", 1),
      blank("left", 2),
      blank("left", 3),
      blank("right", 0),
      blank("right", 1),
      blank("right", 2),
      blank("right", 3),
    ],
    [blank]
  );
  useScreenActions(actions, ["take-card"]);

  return (
    <>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <h3
        className="h3Center"
        style={{ animation: "blink 1s step-start infinite" }}
      >
        Please take your card
      </h3>
    </>
  );
}
