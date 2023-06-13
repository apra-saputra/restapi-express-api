import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import { signToken } from "../helpers/jwt.js";

let prisma;
let server;

beforeAll(() => {
  prisma = new PrismaClient();
  server = app.listen();
});

describe("Products Service - GET /products", () => {
  const email = "john@test.com",
    id = 3;

  const otpMock = "112233";

  let accessTokenMock;
  let invalidAccessTokenMock = "dsadasd.23231";

  beforeAll(async () => {
    const user = await prisma.users.update({
      where: { id: id },
      data: { otp: otpMock },
    });

    accessTokenMock = signToken({
      id,
      expIn: 15 * 60 * 1000,
      username: user.username,
    });
  });

  test("GET /products - Success", () => {
    return request(server)
      .get("/products")
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .query({ limit: 10, skip: 0 })
      .then((res) => {
        console.log({ res: res.body });
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 200);
        expect(res.body).toHaveProperty("status", "SUCCESS GET PRODUCTS");
        expect(res.body).toHaveProperty("payload", expect.any(Object));
        expect(res.body.payload).toHaveProperty("count", expect.any(Number));
        expect(res.body.payload).toHaveProperty("limit", expect.any(Number));
        expect(res.body.payload).toHaveProperty("skip", expect.any(Number));
        expect(res.body.payload).toHaveProperty("data", expect.any(Array));
      });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
