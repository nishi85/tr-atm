import atmSign from "../assets/atm_sign.png";
import graffiti from "../assets/graffiti.png";

export default function ATMTopper() {
  return (
    <div className="atmSign">
      <img src={atmSign} alt="atm-sign" className="atm-sign" />
      <img src={graffiti} alt="grafiti" className="atmSignGrafiti" />
    </div>
  );
}
