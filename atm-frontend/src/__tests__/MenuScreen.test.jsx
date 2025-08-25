import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionsProvider } from "../context/actions.jsx";
import { ATMProvider } from "../context/ATMContext.jsx";
import ScreenHUD from "../components/ScreenHUD.jsx";
import MenuScreen from "../components/screens/MenuScreen.jsx";

test("MenuScreen: 'Withdraw' side button navigates to /withdraw", async () => {
  const user = userEvent.setup();

  render(
    <ATMProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={["/menu"]}>
          <Routes>
            <Route
              path="/menu"
              element={
                <>
                  <ScreenHUD />
                  <MenuScreen />
                </>
              }
            />
            <Route path="/withdraw" element={<div data-testid="wd" />} />
          </Routes>
        </MemoryRouter>
      </ActionsProvider>
    </ATMProvider>
  );

  const btn = await screen.findByRole("button", { name: /withdraw/i });
  await user.click(btn);
  expect(await screen.findByTestId("wd")).toBeInTheDocument();
});
