// src/__tests__/LoadingScreen.test.jsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import LoadingScreen from "../components/screens/LoadingScreen"; // adjust path if needed

test("shows animated Processing… dots", () => {
  vi.useFakeTimers();
  render(<LoadingScreen label="Processing" interval={100} />);

  const status = screen.getByRole("status"); // sync, no polling
  const text = () => status.textContent?.replace(/\s+$/, "");

  expect(text()).toBe("Processing");

  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(text()).toBe("Processing.");

  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(text()).toBe("Processing..");

  act(() => {
    vi.advanceTimersByTime(100);
  });
  expect(text()).toBe("Processing...");

  vi.useRealTimers();
});
