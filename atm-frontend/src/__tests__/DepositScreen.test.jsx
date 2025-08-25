import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ATMProvider } from "../context/ATMContext.jsx";
import { ActionsProvider } from "../context/actions.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";
import DepositScreen from "../components/screens/DepositScreen.jsx";

test("DepositScreen: Confirm disabled until valid amount; Clear empties field", async () => {
  const user = userEvent.setup();

  render(
    <ATMProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={["/deposit"]}>
          <Routes>
            <Route
              path="/deposit"
              element={
                <>
                  <ScreenHUD />
                  <DepositScreen />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  // Confirm starts disabled
  let confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();

  // Type a valid amount
  const input = screen.getByLabelText(/amount/i);
  await user.clear(input);
  await user.type(input, "100"); // your ATMInput normalizes/keeps 2 decimals

  // Confirm should enable
  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).not.toBeDisabled();

  // Click Clear via HUD and Confirm should disable again
  const clearBtn = await screen.findByRole("button", { name: /clear/i });
  await user.click(clearBtn);

  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();
});
