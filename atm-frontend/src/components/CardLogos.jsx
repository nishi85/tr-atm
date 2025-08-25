import { useATM } from "../context/ATMContext";
import cardsBanner from "../assets/creditcard_sprite.png";
import cls from "./CardLogos.module.css";

// widths of each logo slice in the sprite (px)
const SLICES = [
  { type: "star", w: 30 },
  { type: "pulse", w: 33 },
  { type: "maestro", w: 38 },
  { type: "mastercard", w: 30 },
  { type: "interac", w: 30 },
  { type: "visa", w: 26 },
];

export default function CardLogos() {
  const { cardType } = useATM();

  const total = SLICES.reduce((a, s) => a + s.w, 0);
  let acc = 0;

  const overlays = SLICES.map((s) => {
    const leftPct = (acc / total) * 101;
    const wPct = (s.w / total) * 101;
    acc += s.w;
    return (
      <div
        key={s.type}
        className={
          cls.atmCardElement + `${cardType === s.type ? "active" : ""}`
        }
        style={{ "--left": `${leftPct}%`, "--w": `${wPct}%` }}
      />
    );
  });

  return (
    <div className={cls.atmHeader}>
      <img
        src={cardsBanner}
        alt="cards-banner"
        className={cls.atmCardsBanner}
      />
      {overlays}
    </div>
  );
}
