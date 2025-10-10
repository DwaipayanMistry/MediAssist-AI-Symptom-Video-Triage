import request from "supertest";
import app from "../src/index"; // Adjust the import based on your app's structure

describe("Health endpoint", () => {
  it("should return status ok and server info", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe("Server is running smoothly");
    expect(typeof res.body.timeStamp).toBe("string");
    expect(typeof res.body.uptime).toBe("number");
  });
});
