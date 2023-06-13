import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import * as otp from "../helpers/otp.js";
import { signToken } from "../helpers/jwt.js";

let prisma;
let server;

beforeAll(() => {
  prisma = new PrismaClient();
  server = app.listen();
});

describe("Auth Service - POST /login", () => {
  test("POST /login - Success login", () => {
    return request(server)
      .post("/login")
      .send({
        username: "operator_test",
      })
      .then((res) => {
        console.log({ body: res.body });
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 200);
        expect(res.body).toHaveProperty("status", "SUCCESS SENT OTP");
        expect(res.body).toHaveProperty("payload");
        expect(res.body.payload).toBeInstanceOf(Object);
      });
  });

  test("POST /login - Failed login - no input on username", () => {
    return request(server)
      .post("/login")
      .send({
        username: "",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 400);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body).toHaveProperty("payload");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "USERNAME IS REQUIRED"
        );
      });
  });

  test("POST /login - Failed login - no key username", () => {
    return request(server)
      .post("/login")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 400);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body).toHaveProperty("payload");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "USERNAME IS REQUIRED"
        );
      });
  });

  test("POST /login - Failed login - username not in database", () => {
    return request(server)
      .post("/login")
      .send({
        username: "invalidUsername",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 404);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body).toHaveProperty("payload");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "DATA NOT FOUND"
        );
      });
  });
});

describe("Auth Service - POST /confirm-otp", () => {
  const email = "john@test.com",
    id = 3;

  const otpMock = "112233";

  beforeAll(async () => {
    await prisma.users.update({
      where: { id: id },
      data: { otp: otpMock },
    });
  });

  test("POST /confirm-otm - Success", () => {
    return request(server)
      .post("/confirm-otp")
      .send({ email: email, OTP: otpMock })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 200);
        expect(res.body).toHaveProperty("status", "SUCCESS CONFIRM OTP");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "accessToken",
          expect.any(String)
        );
        expect(res.body.payload).toHaveProperty("exp", expect.any(Number));
        expect(res.body.payload).toHaveProperty("access", expect.any(Array));
      });
  });

  test("POST /confirm-otm - Failed - No input on username", () => {
    return request(server)
      .post("/confirm-otp")
      .send({ email: "", OTP: otpMock })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 400);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "EMAIL IS REQUIRED"
        );
      });
  });

  test("POST /confirm-otm - Failed - Otp False", () => {
    return request(server)
      .post("/confirm-otp")
      .send({ email, OTP: "123" })
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 401);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "INVALID LOGIN"
        );
      });
  });

  test("POST /confirm-otm - Failed - No key Otp", () => {
    return request(server)
      .post("/confirm-otp")
      .send({ email })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 400);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toBeInstanceOf(Object);
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "OTP IS REQUIRED"
        );
      });
  });

  describe("Failed - Expired OTP", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(otp, "validateExpiredOtp").mockReturnValue(true);
    });

    test("POST /confirm-otm - Failed - Expired OTP", () => {
      return request(server)
        .post("/confirm-otp")
        .send({ email: email, OTP: otpMock })
        .then((res) => {
          expect(res.status).toBe(419);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("statusCode", 419);
          expect(res.body).toHaveProperty("status", "ERROR");
          expect(res.body.payload).toBeInstanceOf(Object);
          expect(res.body.payload).toHaveProperty(
            "errorMessage",
            "OTP IS EXPIRED"
          );
        });
    });
  });

  afterAll(async () => {
    await prisma.users.update({ where: { id: id }, data: { otp: null } });
  });
});

describe("Auth Service - PATCH /logout", () => {
  const email = "john@test.com",
    id = 3;

  const otpMock = "112233";

  let accessTokenMock;
  let invalidAccessTokenMock;

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

  test("PATCH /logout- Success", () => {
    return request(server)
      .patch("/logout")
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 200);
        expect(res.body).toHaveProperty("status", "SUCCESS LOGOUT");
      });
  });

  test("PATCH /logout - Failed - Get Access Token", () => {
    return request(server)
      .patch("/logout")
      .set("Authorization", `Bearer ${invalidAccessTokenMock}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
      });
  });

  describe.only("Failed - Get Access Token", () => {
    let wrongId = 100;

    beforeAll(async () => {
      invalidAccessTokenMock = signToken({
        id: wrongId,
        expIn: 15 * 60 * 1000,
        username: "user.username",
      });
    });

    test("PATCH /logout - Failed - Wrong User id on Access Token", () => {
      return request(server)
        .patch("/logout")
        .set("Authorization", `Bearer ${invalidAccessTokenMock}`)
        .then((res) => {
          console.log({ res: res.body });
          // expect(res.status).toBe(403);
          // expect(res.body).toBeInstanceOf(Object);
          // expect(res.body).toHaveProperty("statusCode", 403);
          // expect(res.body).toHaveProperty("status", "ERROR");
        });
    });
  });

  afterAll(async () => {
    await prisma.users.update({ where: { id: id }, data: { otp: null } });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
