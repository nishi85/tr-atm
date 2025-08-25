export const CARD_TYPES = [
  { key: "pulse", label: "Pulse", hotkey: "1" },
  { key: "visa", label: "Visa", hotkey: "2" },
  { key: "mastercard", label: "MasterCard", hotkey: "3" },
  { key: "maestro", label: "Maestro", hotkey: "4" },
  { key: "star", label: "Star", hotkey: "5" },
  { key: "interac", label: "Interac", hotkey: "6" },
];

export const labelForCardType = (t) =>
  CARD_TYPES.find((ct) => ct.key === t)?.label ?? "Card";
