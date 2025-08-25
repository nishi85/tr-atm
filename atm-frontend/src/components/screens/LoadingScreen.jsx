import { useEffect, useState } from "react";
import cls from "./LoadingScreen.module.css";

export default function LoadingScreen({
  label = "Processing",
  interval = 350,
}) {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cls.root}>
      <div className={cls.badge}>
        {label}
        {".".repeat(dots).padEnd(3, " ")}
      </div>
    </div>
  );
}
