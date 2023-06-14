import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";

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
