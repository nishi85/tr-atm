process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../index.js";
import { resetDb } from "../services/db.js";

beforeEach(() => {
  resetDb(); // reset test state
});

describe("ATM API", () => {
  it("health check should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("login + deposit flow (cookie session)", async () => {
    const agent = request.agent(app);
    const login = await agent.post("/api/login").send({ pin: "1111" });
    expect(login.status).toBe(200);
    const deposit = await agent.post("/api/deposit").send({ amount: 50 });
    expect(deposit.status).toBe(200);
    expect(typeof deposit.body.balance).toBe("number");
  });

  it("withdraw should fail with insufficient funds", async () => {
    const agent = request.agent(app);
    await agent.post("/api/login").send({ pin: "1111" });
    const withdraw = await agent.post("/api/withdraw").send({ amount: 4000 });
    expect(withdraw.status).toBe(400);
    expect(withdraw.body.error).toBe("Insufficient funds");
  });

  it("rejects withdraws not in $20 increments", async () => {
    const agent = request.agent(app);
    await agent.post("/api/login").send({ pin: "1111" });

    const bad = await agent.post("/api/withdraw").send({ amount: 25 });
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe("Amount must be a multiple of 20");
  });

  it("rejects deposit of negative and non-number amounts", async () => {
    const agent = request.agent(app);
    await agent.post("/api/login").send({ pin: "1111" });

    const neg = await agent.post("/api/deposit").send({ amount: -10 });
    expect(neg.status).toBe(400);
    expect(neg.body.error).toBe("Amount must be > 0");

    const nonNum = await agent.post("/api/deposit").send({ amount: "abc" });
    expect(nonNum.status).toBe(400);
    expect(nonNum.body.error).toBe("Amount must be a number");
  });

  it("rejects deposits above single-transaction cap ($5,000)", async () => {
    const agent = request.agent(app);
    await agent.post("/api/login").send({ pin: "1111" });

    const big = await agent.post("/api/deposit").send({ amount: 5001 });
    expect(big.status).toBe(400);
    expect(big.body.error).toBe(
      "Amount exceeds single-transaction limit ($5,000)"
    );
  });
});
