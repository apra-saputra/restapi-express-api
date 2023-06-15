import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import { signToken } from "../helpers/jwt.js";
import OrderControl from "../controller/orderControl.js";
import { transactionAction, transactionCreation } from "../helpers/utils.js";

let prisma,
  server,
  accessTokenMock,
  accessTokenSPVMock,
  accessTokenMGRMock,
  idMock,
  data,
  products = [];

const username = "operator_test",
  idUser = 3,
  idInvalidMock = 9999,
  { getOrders } = OrderControl;

const dataMock = [
  {
    name: "test barang 1",
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    qty: 20,
    price: 20000,
    TagId: 2,
  },
  {
    name: "test barang 2",
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    qty: 10,
    price: 10000,
    TagId: 2,
  },
];

beforeAll(async () => {
  prisma = new PrismaClient();
  server = app.listen();

  // idMock = 4;

  accessTokenMock = signToken({
    id: idUser,
    expIn: 15 * 60 * 1000,
    username: username,
  });

  accessTokenSPVMock = signToken({
    id: 2,
    expIn: 15 * 60 * 1000,
    username: "spv_test",
  });

  accessTokenMGRMock = signToken({
    id: 1,
    expIn: 15 * 60 * 1000,
    username: "mgr_test",
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

  test("GET /orders - Success - Without query", async () => {
    const statusCode = 200,
      limit = 10,
      skip = 0,
      service = "owner";

    const res = await supertest(server)
      .get("/orders")
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
  beforeEach(async () => {
    data = await transactionCreation(dataMock, idUser, 2);

    data.forEach((item) => {
      idMock = item.OrderId;
      products.push(item.ProductId);
    });
  });

  afterEach(async () => {
    try {
      await prisma.orders.delete({ where: { id: idMock } });
      await prisma.products.deleteMany({ where: { id: { in: products } } });
      await prisma.productOrders.deleteMany({
        where: { id: { in: products } },
      });
    } catch (error) {
      console.error("Error occurred while deleting test data:", error);
    }
  });

  test("GET /orders/{id} - Success", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .get(`/orders/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS GET ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
  });

  test("GET /orders/{id} - Failed - Invalid Id Order", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .get(`/orders/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });
});

describe("Order Service - Create Order", () => {
  const emptyFilePath =
      "D:/coding/project/restapi-express-api/public/templates/template_product.xlsx",
    wrongFilePath =
      "D:/coding/project/restapi-express-api/temp/Snake_River_(5mb).jpg",
    wrongCase2FilePath =
      "D:/coding/project/restapi-express-api/temp/template_product_test_case-2.xlsx",
    filePath =
      "D:/coding/project/restapi-express-api/temp/template_product_test.xlsx";

  test("POST /orders - Success", async () => {
    const statusCode = 201;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 1)
      .attach("docs", filePath);

    res.body.payload.data.forEach((item) => {
      idMock = item.OrderId;
      products.push(item.ProductId);
    });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS CREATE ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Array));

    try {
      await prisma.orders.delete({ where: { id: idMock } });
      await prisma.products.deleteMany({ where: { id: { in: products } } });
      await prisma.productOrders.deleteMany({
        where: { id: { in: products } },
      });
    } catch (error) {
      console.error("Error occurred while deleting test data:", error);
    }
  });

  test("POST /orders - Failed - No File Upload", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 1);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "NO FILE UPLOADED");
  });

  test("POST /orders - Failed - Invalid Type Doc", async () => {
    const statusCode = 422;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 1)
      .attach("docs", wrongFilePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty(
      "errorMessage",
      "FORMAT MUST BE XLSX, XLS"
    );
  });

  test("POST /orders - Failed - No Data Found", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 1)
      .attach("docs", emptyFilePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });

  test("POST /orders - Failed - Invalid Tag id", async () => {
    const statusCode = 400;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 1)
      .attach("docs", wrongCase2FilePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty(
      "errorMessage",
      "INVALID TAGID NUMBER 2"
    );
  });

  test("POST /orders - Failed - wrong action for user", async () => {
    const statusCode = 403;
    const res = await supertest(server)
      .post(`/orders`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .field("workflowId", 4)
      .attach("docs", filePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "FORBIDEN");
  });
});

describe("Order Service - Update Order By Action User", () => {
  beforeEach(async () => {
    data = await transactionCreation(dataMock, idUser, 2);

    data.forEach((item) => {
      idMock = item.OrderId;
      products.push(item.ProductId);
    });
  });

  afterEach(async () => {
    try {
      await prisma.orders.delete({ where: { id: idMock } });
      await prisma.products.deleteMany({ where: { id: { in: products } } });
      await prisma.productOrders.deleteMany({
        where: { id: { in: products } },
      });
    } catch (error) {
      console.error("Error occurred while deleting test data:", error);
    }
  });

  test("PATCH /orders/actions - Success - User: SPV APPROVE", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenSPVMock}`)
      .send({ payload: [idMock], actionId: 3 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS ACTION ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty(
      "message",
      "ORDER_APPROVED_BY_SPV"
    );
  });

  test("PATCH /orders/actions - Success - User: SPV REJECT", async () => {
    const statusCode = 200;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenSPVMock}`)
      .send({ payload: [idMock], actionId: 4 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS ACTION ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty(
      "message",
      "ORDER_REJECT_BY_SPV"
    );
  });

  test("PATCH /orders/actions - Success - User: MGR APPROVE", async () => {
    const workflow = await prisma.workflows.findUnique({
      where: { id: 3 },
      include: { Positions: { include: { Users: true } }, Stages: true },
    });
    await transactionAction([idMock], workflow);

    const statusCode = 200;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenMGRMock}`)
      .send({ payload: [idMock], actionId: 5 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS ACTION ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty(
      "message",
      "ORDER_APPROVED_BY_MGR"
    );
  });

  test("PATCH /orders/actions - Success - User: PRCH CANCEL", async () => {
    const workflow = await prisma.workflows.findUnique({
      where: { id: 3 },
      include: { Positions: { include: { Users: true } }, Stages: true },
    });
    await transactionAction([idMock], workflow);

    const workflowStep2 = await prisma.workflows.findUnique({
      where: { id: 6 },
      include: { Positions: { include: { Users: true } }, Stages: true },
    });
    await transactionAction([idMock], workflowStep2);

    const statusCode = 200;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .send({ payload: [idMock], actionId: 2 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS ACTION ORDER");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty("message", "ORDER_CANCEL");
  });

  test("PATCH /orders/actions - FAILED - Wrong Action For User Action", async () => {
    const statusCode = 401;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenMGRMock}`)
      .send({ payload: [idMock], actionId: 6 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "ACCESS DENIED");
  });

  test("PATCH /orders/actions - Failed - No OrderId in Payload", async () => {
    const statusCode = 404;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenSPVMock}`)
      .send({ payload: undefined, actionId: 3 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "NO ORDER SENT");
  });

  test("PATCH /orders/actions - Failed - Invalid Actions", async () => {
    const statusCode = 403;
    const res = await supertest(server)
      .patch(`/orders/actions`)
      .set("Authorization", `Bearer ${accessTokenSPVMock}`)
      .send({ payload: [idMock], actionId: 5 });

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "FORBIDEN");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
