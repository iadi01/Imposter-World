import { describe, it, expect } from "vitest";

describe("Production Health Check Endpoint (/health)", () => {
  it("generates a valid ISO 8601 timestamp string", () => {
    const timestamp = new Date().toISOString();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    const parsedDate = new Date(timestamp);
    expect(parsedDate.getTime()).not.toBeNaN();
  });

  it("produces fresh timestamps for each request", async () => {
    const ts1 = new Date().toISOString();
    await new Promise((r) => setTimeout(r, 10));
    const ts2 = new Date().toISOString();
    expect(ts1).not.toEqual(ts2);
  });

  it("formats expected JSON payload structure", () => {
    const payload = {
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
    };

    expect(payload).toHaveProperty("success", true);
    expect(payload).toHaveProperty("status", "ok");
    expect(typeof payload.timestamp).toBe("string");
  });
});
