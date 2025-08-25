import { get, post } from "./client";

export const atmApi = {
  loginWithPin: (pin) => post("/api/login", { pin }),
  getBalance: () => get("/api/transactions"),
  withdraw: (amount) => post("/api/withdraw", { amount }),
  deposit: (amount) => post("/api/deposit", { amount }),
  logout: () => post("/api/logout"),
};
