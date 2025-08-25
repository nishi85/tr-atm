import {
  parseMoney,
  formatMoney,
  toMinor,
  MAX_SINGLE_TX,
} from "../components/utils/money";

test("parseMoney and formatMoney round-trip to 2 decimals", () => {
  expect(formatMoney(parseMoney("100"), 2)).toBe("100.00");
  expect(formatMoney(parseMoney("0.5"), 2)).toBe("0.50");
  expect(formatMoney(parseMoney("12.345"), 2)).toBe("12.35"); // rounds
});

test("toMinor converts dollars to cents correctly", () => {
  expect(toMinor(0)).toBe(0);
  expect(toMinor(1)).toBe(100);
  expect(toMinor(12.34)).toBe(1234);
});
