import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import response from "../helpers/response.js";

let prisma;
let server;

beforeAll(() => {
  prisma = new PrismaClient();
  server = app.listen();
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});

describe("Additional test - GET / ", () => {
  test("GET / - Success", async () => {
    const res = await request(server).get("/");
    await expect(res.status).toBe(200);
    await expect(res.text).toBe("service ready...🚀");
  });
});

describe("Additional test - Response FN", () => {
  test("test", async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const statusCode = 200;
    const status = "OK";
    const data = { message: "Success" };

    response(mockRes, statusCode, status, data);

    expect(mockRes.status).toHaveBeenCalledWith(statusCode);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode,
      status,
      payload: data,
    });
  });
});
