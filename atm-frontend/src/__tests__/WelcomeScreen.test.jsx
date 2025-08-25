// src/__tests__/WelcomeScreen.test.jsx
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionsProvider } from "../context/actions.jsx";
import { ATMProvider } from "../context/ATMContext.jsx";
import WelcomeScreen from "../components/screens/WelcomeScreen.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";

test("WelcomeScreen: 'Enter PIN' side button navigates to /pin", async () => {
  const user = userEvent.setup();

  render(
    <ATMProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ScreenHUD />
                  <WelcomeScreen />
                </>
              }
            />
            <Route path="/pin" element={<div data-testid="pin" />} />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  // Wait for useScreenActions to publish the label to HUD
  const btn = await screen.findByRole("button", { name: /enter pin/i });

  // Click it and assert navigation
  await user.click(btn);
  expect(await screen.findByTestId("pin")).toBeInTheDocument();
});
