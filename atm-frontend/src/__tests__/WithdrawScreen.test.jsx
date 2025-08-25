import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { ATMProvider, useATM } from "../context/ATMContext.jsx";
import { ActionsProvider } from "../context/actions.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";
import WithdrawScreen from "../components/screens/WithdrawScreen.jsx";

// Mock the API shape the context expects (dollars in/out)
vi.mock("../api/atmApi", () => ({
  atmApi: {
    loginWithPin: vi
      .fn()
      .mockResolvedValue({ session: { holder: "Test" }, balance: 1000 }),
    getBalance: vi.fn().mockResolvedValue({ balance: 1000 }),
    deposit: vi.fn().mockResolvedValue({ balance: 1100 }),
    withdraw: vi.fn().mockResolvedValue({ balance: 900 }),
    logout: vi.fn().mockResolvedValue({}),
  },
}));

// Seed balance using refreshBalance so available = 1000
function SeedBalance() {
  const { refreshBalance } = useATM();
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);
  return null;
}

test("WithdrawScreen: Other mode enforces $20 multiples; enables Confirm on valid amount", async () => {
  const user = userEvent.setup();

  render(
    <ATMProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={["/withdraw"]}>
          <Routes>
            <Route
              path="/withdraw"
              element={
                <>
                  <ScreenHUD />
                  <SeedBalance />
                  <WithdrawScreen />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  // Enter "Other" mode
  const otherBtn = await screen.findByRole("button", { name: /other/i });
  await user.click(otherBtn);

  // Confirm starts disabled
  let confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();

  // Type non-multiple of 20 => still disabled
  const input = screen.getByLabelText(/amount/i);
  await user.clear(input);
  await user.type(input, "25");
  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).toBeDisabled();

  // Type valid multiple of 20 => enabled
  await user.clear(input);
  await user.type(input, "40");
  confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).not.toBeDisabled();
});
