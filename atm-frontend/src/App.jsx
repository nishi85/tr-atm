import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ATMProvider, useATM } from "./context/ATMContext";
import { ActionsProvider } from "./context/actions";
import ATMErrorBoundary from "./components/ATMErrorBoundary";
import ATMLayout from "./components/layout/ATMLayout";

import PinScreen from "./components/screens/PinScreen";
import MenuScreen from "./components/screens/MenuScreen";
import WithdrawScreen from "./components/screens/WithdrawScreen";
import DepositScreen from "./components/screens/DepositScreen";
import BalanceScreen from "./components/screens/BalanceScreen";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import SummaryScreen from "./components/screens/SummaryScreen";
import TakeCardScreen from "./components/screens/TakeCardScreen";

import "./styles.css";

function RequireAuth() {
  const { session } = useATM();
  return session ? <Outlet /> : <Navigate to="/" replace />;
}

function LayoutWithBoundary() {
  return (
    <ATMLayout>
      <ATMErrorBoundary resetTo="/take-card">
        <Outlet />
      </ATMErrorBoundary>
    </ATMLayout>
  );
}

export default function App() {
  return (
    <ATMProvider>
      <ActionsProvider>
        <Routes>
          <Route element={<LayoutWithBoundary />}>
            {/* Public routes */}
            <Route index element={<WelcomeScreen />} />
            <Route path="pin" element={<PinScreen />} />
            <Route path="take-card" element={<TakeCardScreen />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>
              <Route path="menu" element={<MenuScreen />} />
              <Route path="withdraw" element={<WithdrawScreen />} />
              <Route path="deposit" element={<DepositScreen />} />
              <Route path="balance" element={<BalanceScreen />} />
              <Route path="summary" element={<SummaryScreen />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ActionsProvider>
    </ATMProvider>
  );
}
