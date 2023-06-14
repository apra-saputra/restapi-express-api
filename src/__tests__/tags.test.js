import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import { signToken } from "../helpers/jwt.js";
import TagControl from "../controller/tagsControl.js";

let prisma, server, accessTokenMock, idMock;

const username = "operator_test",
  id = 3,
  idInvalidMock = 9999,
  { getTags } = TagControl;

beforeAll(async () => {
  prisma = new PrismaClient();
  server = app.listen();

  idMock = 2;

  accessTokenMock = signToken({
    id,
    expIn: 15 * 60 * 1000,
    username: username,
  });
});

describe("Tags Service - Get All Tag", () => {
  test("GET /tags - Success", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .get("/tags")
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS GET TAGS");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));
  });
});

describe("Tags Service - Get All Tag", () => {
  test("GET /tags - Failed", async () => {
    const errorMock = new Error("Test Error");
    const req = { query: {} };
    const res = {};
    const next = jest.fn();

    jest
      .spyOn(prisma.products, "findMany")
      .mockImplementation(() => Promise.reject(errorMock));

    await getTags(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Tags Service - Get Tag By id", () => {
  test("GET /tags/{id} - Success", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .get(`/tags/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS GET TAG");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
  });

  test("GET /tags/{id} - Failed - Invalid id", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .get(`/tags/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });
});

describe("Tags Service - Update Tag By id", () => {
  beforeEach(async () => {
    const tags = await prisma.tags.create({ data: { name: "Obat Test" } });

    idMock = tags.id;
  });

  test("PUT /tags/{id} - Success", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .put(`/tags/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .send({ name: "Makanan" });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS UPDATE TAG");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
  });

  test("PUT /tags/{id} - Failed - No Input Name", async () => {
    const statusCode = 400;
    const res = await supertest(server)
      .put(`/tags/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "NAME IS REQUIRED");
  });

  test("PUT /tags/{id} - Failed - Invalid id", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .put(`/tags/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .send({ name: "Makanan" });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });

  afterEach(async () => {
    await prisma.tags.delete({ where: { id: idMock } });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
