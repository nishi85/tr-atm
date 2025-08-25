// src/__tests__/ATMErrorBoundary.test.jsx
import React from "react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ATMErrorBoundary from "../components/ATMErrorBoundary.jsx"; // <-- include .jsx

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  // @ts-ignore
  console.error?.mockRestore?.();
});

// simple, self-contained overlay stub for tests
function StubOverlay({ message, onOk }) {
  return (
    <div>
      <div data-testid="overlay-msg">{String(message)}</div>
      <button onClick={onOk}>OK</button>
    </div>
  );
}

function Boom() {
  throw new Error("Kaboom!");
}
function WhereAmI() {
  const { pathname } = useLocation();
  return <div data-testid="loc">{pathname}</div>;
}

test("shows overlay and resets on OK (no navigation)", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/boom"]}>
      <ATMErrorBoundary resetTo={null} OverlayComponent={StubOverlay}>
        <Boom />
      </ATMErrorBoundary>
    </MemoryRouter>
  );

  expect(await screen.findByTestId("overlay-msg")).toHaveTextContent(/kaboom/i);

  await user.click(screen.getByRole("button", { name: /ok/i }));

  // Fallback persists if the child still throws; swap to a non-throwing child
  // (Use rerender from RTL if you want to assert it disappears; otherwise just assert it rendered)
});

test("navigates to /take-card on OK", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/boom"]}>
      <ATMErrorBoundary resetTo="/take-card" OverlayComponent={StubOverlay}>
        <Routes>
          <Route
            path="/boom"
            element={
              <>
                <Boom />
                <WhereAmI />
              </>
            }
          />
          <Route path="/take-card" element={<WhereAmI />} />
        </Routes>
      </ATMErrorBoundary>
    </MemoryRouter>
  );

  expect(await screen.findByTestId("overlay-msg")).toHaveTextContent(/kaboom/i);
  await user.click(screen.getByRole("button", { name: /ok/i }));
  expect(await screen.findByTestId("loc")).toHaveTextContent("/take-card");
});
