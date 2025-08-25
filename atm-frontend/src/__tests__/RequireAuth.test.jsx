import {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { ATMProvider, useATM } from "../context/ATMContext.jsx";

function RequireAuth() {
  const { session } = useATM();
  return session ? <Outlet /> : <Navigate to="/" replace />;
}

function Public() {
  return <div data-testid="public" />;
}
function Private() {
  return <div data-testid="private" />;
}

test("redirects to / when session is null", () => {
  render(
    <ATMProvider>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/" element={<Public />} />
          <Route element={<RequireAuth />}>
            <Route path="/private" element={<Private />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ATMProvider>
  );
  expect(screen.getByTestId("public")).toBeInTheDocument();
});
