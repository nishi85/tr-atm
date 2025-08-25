import CardLogos from "./CardLogos";
import ATMScreen from "./ATMScreen";
import sticker_graf from "../assets/sticker_graf.png";
import systems from "../assets/systems.png";
import cls from "./ATMBody.module.css";

export default function ATMBody({ children }) {
  return (
    <div className={cls.atmBody}>
      <CardLogos />
      <ATMScreen />

      {children}
      <div className={cls.atmBottom}>
        <div>
          <img
            src={sticker_graf}
            alt="sticker_grafiti"
            className={cls.atmStickerGraf}
          />
        </div>
        <img src={systems} alt="systems" className={cls.atmSystems} />
      </div>
    </div>
  );
}
