import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionsProvider } from "../context/actions.jsx";
import { ATMProvider } from "../context/ATMContext.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";
import PinScreen from "../components/screens/PinScreen.jsx";

test("PinScreen: Confirm disabled <4 digits, enabled at 4+", async () => {
  const user = userEvent.setup();

  render(
    <ATMProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={["/pin"]}>
          <Routes>
            <Route
              path="/pin"
              element={
                <>
                  <ScreenHUD />
                  <PinScreen />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  // Confirm should start disabled
  let confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();

  // Type 3 digits -> still disabled
  const input = screen.getByLabelText(/pin:/i);
  await user.type(input, "123");
  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();

  // Type 4th digit -> enabled
  await user.type(input, "4");
  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).not.toBeDisabled();
});
