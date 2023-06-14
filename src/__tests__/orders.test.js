import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import { signToken } from "../helpers/jwt.js";
import OrderControl from "../controller/ordersModule/orderControl.js";

let prisma, server, accessTokenMock, idMock;

const username = "operator_test",
  idUser = 3,
  idInvalidMock = 9999,
  { getOrders } = OrderControl;

beforeAll(async () => {
  prisma = new PrismaClient();
  server = app.listen();

  idMock = 4;

  accessTokenMock = signToken({
    id: idUser,
    expIn: 15 * 60 * 1000,
    username: username,
  });
});

describe("Order Service - Get All Order", () => {
  test("GET /orders - Success - Type: owner", async () => {
    const statusCode = 200,
      limit = 10,
      skip = 0,
      service = "owner";

    const res = await supertest(server)
      .get("/orders")
      .query({ typeService: service, limit, skip })
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty(
      "status",
      `SUCCESS GET ORDERS, TYPE: ${service.toUpperCase()}`
    );
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("count", expect.any(Number));
    expect(res.body.payload).toHaveProperty("limit", limit);
    expect(res.body.payload).toHaveProperty("skip", skip);
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));
  });

  test("GET /orders - Success - Type: done", async () => {
    const statusCode = 200,
      limit = 10,
      skip = 0,
      service = "done";

    const res = await supertest(server)
      .get("/orders")
      .query({ typeService: service, limit, skip })
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty(
      "status",
      `SUCCESS GET ORDERS, TYPE: ${service.toUpperCase()}`
    );
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("count", expect.any(Number));
    expect(res.body.payload).toHaveProperty("limit", limit);
    expect(res.body.payload).toHaveProperty("skip", skip);
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));
  });

  test("GET /orders - Success - Type: approval", async () => {
    const statusCode = 200,
      limit = 10,
      skip = 0,
      service = "approval";

    const res = await supertest(server)
      .get("/orders")
      .query({ typeService: service, limit, skip })
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty(
      "status",
      `SUCCESS GET ORDERS, TYPE: ${service.toUpperCase()}`
    );
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("count", expect.any(Number));
    expect(res.body.payload).toHaveProperty("limit", limit);
    expect(res.body.payload).toHaveProperty("skip", skip);
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));
  });

  test("GET /orders - Success - Type: modify", async () => {
    const statusCode = 200,
      limit = 10,
      skip = 0,
      service = "modify";

    const res = await supertest(server)
      .get("/orders")
      .query({ typeService: service, limit, skip })
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty(
      "status",
      `SUCCESS GET ORDERS, TYPE: ${service.toUpperCase()}`
    );
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("count", expect.any(Number));
    expect(res.body.payload).toHaveProperty("limit", limit);
    expect(res.body.payload).toHaveProperty("skip", skip);
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));
  });

  test("GET /orders - Failed - Next", async () => {
    const errorMock = new Error("Test Error");
    const req = { query: {} };
    const res = {};
    const next = jest.fn();

    jest
      .spyOn(prisma, "$transaction")
      .mockImplementation(() => Promise.reject(errorMock));
    jest.spyOn(prisma.orders, "findMany").mockReturnValue([]);
    jest.spyOn(prisma.orders, "count").mockReturnValue(0);

    await getOrders(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Order Service - Get Order By Id", () => {
  // beforeEach(async () => {
  //   const products = Array(2).map(async (_, index) => {
  //     const result = await prisma.products.create({
  //       data: {
  //         name: "test barang 1",
  //         description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  //         qty: 20,
  //         price: 20000,
  //         TagId: 2,
  //       },
  //     });
  //     return result;
  //   });

  //   const orders = await prisma.orders.create({
  //     data: { AuthorId: 3, qty: 12, totalAmount: 200000 },
  //   });

  //   products.forEach(async(item,index)=>{
  //     await prisma.
  //   })
  // });

  afterEach(async () => {});

  test("GET /orders/{id} - Success", async () => {
    const res = await supertest(server).get(`/orders/${idMock}`);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
