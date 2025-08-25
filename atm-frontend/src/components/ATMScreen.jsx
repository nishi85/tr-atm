import { Outlet } from "react-router-dom";
import ScreenHUD from "./ScreenHUD";

export default function ATMScreen() {
  return (
    <div className="screen">
      <Outlet />
      <ScreenHUD />
    </div>
  );
}
