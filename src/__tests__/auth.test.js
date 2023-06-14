import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import * as otp from "../helpers/otp.js";
import { signToken } from "../helpers/jwt.js";
import AuthControl from "../controller/authControl.js";

let prisma;
let server;
const { logout } = AuthControl;

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

  afterAll(async () => {
    await prisma.users.update({ where: { id: id }, data: { otp: null } });
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
});

describe("Auth Service - PATCH /logout", () => {
  test("PATCH /logout - Failed - Next Error", async () => {
    // Mock request object dengan user ID yang valid
    const req = { user: { id: 1 } };
    const res = {};
    const next = jest.fn();

    // Mock error yang akan dilempar oleh PrismaClient
    const errorMock = "Test Error";
    jest.spyOn(prisma.users, "update").mockRejectedValueOnce(errorMock);

    // Panggil fungsi logout
    await logout(req, res, next);

    // Periksa apakah next terpanggil dengan error yang benar
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Failed Middleware", () => {
  let wrongId = 100;
  let accessTokenMock;
  let invalidAccessTokenMock;

  beforeAll(async () => {
    invalidAccessTokenMock = signToken({
      id: wrongId,
      expIn: 15 * 60 * 1000,
      username: "mgr_test",
    });

    accessTokenMock = signToken({
      id: 1,
      expIn: 15 * 60 * 1000,
      username: "mgr_test",
    });
  });

  test("PATCH /logout - Failed Middleware - No Authorization", () => {
    return request(server)
      .patch("/logout")
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "ACCESS TOKEN INVALID"
        );
      });
  });

  test("PATCH /logout - Failed Middleware - with null value", () => {
    return request(server)
      .patch("/logout")
      .set("Authorization", ` `)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "ACCESS TOKEN INVALID"
        );
      });
  });

  test("PATCH /logout - Failed Middleware - with unlist id user on database", () => {
    return request(server)
      .patch("/logout")
      .set("Authorization", `Bearer ${invalidAccessTokenMock}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "ACCESS TOKEN INVALID"
        );
      });
  });

  test("PATCH /logout - Failed Middleware - with random access token", () => {
    const randomAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJ1c2VybmFtZSI6Im1ncl90ZXN0IiwiaWF0IjoxNjg2NzA5NjM0LCJleHAiOjE2ODc2MDk2MzR9.aA9KiQkevU6WFDR9b544neJvhFtKaNAGAvIUriTzCEwjjj";

    return request(server)
      .patch("/logout")
      .set("Authorization", `Bearer ${randomAccessToken}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "ACCESS TOKEN INVALID"
        );
      });
  });

  test("PATCH /logout - Failed Middleware - with only bearer", () => {
    return request(server)
      .patch("/logout")
      .set("Authorization", `Bearer `)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 403);
        expect(res.body).toHaveProperty("status", "ERROR");
        expect(res.body.payload).toHaveProperty(
          "errorMessage",
          "ACCESS TOKEN INVALID"
        );
      });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
