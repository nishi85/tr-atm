import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ATMProvider } from "../context/ATMContext.jsx";
import { ActionsProvider } from "../context/actions.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";
import PinScreen from "../components/screens/PinScreen.jsx";

// Mock the API used by ATMContext.enterPin
vi.mock("../api/atmApi", () => ({
  atmApi: {
    loginWithPin: vi.fn().mockResolvedValue({
      session: { holder: "Test User", cardType: "VISA" },
      balance: 350,
    }),
    getBalance: vi.fn(),
    deposit: vi.fn(),
    withdraw: vi.fn(),
    logout: vi.fn(),
  },
}));
import { atmApi } from "../api/atmApi";

test("PinScreen: typing 4 digits enables Confirm and navigates to /menu", async () => {
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
            <Route path="/menu" element={<div data-testid="menu" />} />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  // Type a valid 4-digit PIN
  const input = screen.getByLabelText(/pin:/i);
  await user.type(input, "1234");

  // Confirm should be enabled once 4 digits entered
  const confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  expect(confirmBtn).not.toBeDisabled();

  // Click Confirm
  await user.click(confirmBtn);

  // Assert API was called with the typed PIN and we navigated to /menu
  await waitFor(() => {
    expect(atmApi.loginWithPin).toHaveBeenCalledWith("1234");
  });
  expect(await screen.findByTestId("menu")).toBeInTheDocument();
});
