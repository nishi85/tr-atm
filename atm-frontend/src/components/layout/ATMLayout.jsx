import ATMChassis from "../ATMChassis";
import ATMTopper from "../ATMTopper";
import ATMBody from "../ATMBody";

export default function ATMLayout() {
  return (
    <ATMChassis>
      <ATMTopper />
      <ATMBody />
    </ATMChassis>
  );
}
