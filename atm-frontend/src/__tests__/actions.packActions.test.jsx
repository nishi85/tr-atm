import { packActions } from "../context/actions.jsx";

test("packActions maps side/row to 0..7 correctly", () => {
  const list = [
    { side: "left", row: 0, label: "L0" },
    { side: "left", row: 3, label: "L3" },
    { side: "right", row: 0, label: "R0" },
    { side: "right", row: 3, label: "R3" },
  ];
  const packed = packActions(list);

  expect(packed[0].label).toBe("L0"); // left 0 -> 0
  expect(packed[3].label).toBe("L3"); // left 3 -> 3
  expect(packed[4].label).toBe("R0"); // right 0 -> 4
  expect(packed[7].label).toBe("R3"); // right 3 -> 7
});
