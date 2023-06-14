import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import response from "../helpers/response.js";
import { validateExpiredOtp } from "../helpers/otp.js";

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

describe("Additional Test - GET / ", () => {
  test("GET / - Success", async () => {
    const res = await request(server).get("/");
    await expect(res.status).toBe(200);
    await expect(res.text).toBe("service ready...🚀");
  });
});

describe("Additional Test - validateExpiredOtp FN", () => {
  test("should return true if OTP is expired", () => {
    const data = {
      updatedAt: "2023-06-12T12:00:00.000Z", // Set the updatedAt value to an expired time
    };

    const result = validateExpiredOtp(data);

    expect(result).toBe(true);
  });

  test("should return false if OTP is not expired", () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // Set the updatedAt value to 5 minutes ago

    const data = {
      updatedAt: fiveMinutesAgo.toISOString(),
    };

    const result = validateExpiredOtp(data);

    expect(result).toBe(undefined);
  });
});

describe("Additional Test - Response FN", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should set the correct status code and response body", () => {
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

  test("should set the default status code and response body if not provided", () => {
    const defaultStatusCode = 200;
    const defaultStatus = "OK";
    const defaultData = {};

    response(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(defaultStatusCode);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode: defaultStatusCode,
      status: defaultStatus,
      payload: defaultData,
    });
  });
});
