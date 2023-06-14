import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app.js";
import { signToken } from "../helpers/jwt.js";
import ProductControl from "../controller/productControl.js";
import path from "path";

let prisma, server, accessTokenMock, product, idMock;

const { getProducts, downloadTemplateProduct, updateImageProduct } =
    ProductControl,
  username = "operator_test",
  id = 3,
  idInvalidMock = 9999;

beforeAll(async () => {
  prisma = new PrismaClient();
  server = app.listen();

  idMock = 4;

  accessTokenMock = signToken({
    id,
    expIn: 15 * 60 * 1000,
    username: username,
  });
});

describe("Products Service - Get Products", () => {
  test("GET /products - Success", () => {
    return request(server)
      .get("/products")
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .query({ limit: 10, skip: 0 })
      .then((res) => {
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

  test("GET /products - Success - without query", () => {
    return request(server)
      .get("/products")
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("statusCode", 200);
        expect(res.body).toHaveProperty("status", "SUCCESS GET PRODUCTS");
        expect(res.body).toHaveProperty("payload", expect.any(Object));
        expect(res.body.payload).toHaveProperty("count", expect.any(Number));
        expect(res.body.payload).toHaveProperty("limit", 10);
        expect(res.body.payload).toHaveProperty("skip", 0);
        expect(res.body.payload).toHaveProperty("data", expect.any(Array));
      });
  });

  test("GET /products - Next Error", async () => {
    const errorMock = new Error("Test Error");
    const req = { query: {} };
    const res = {};
    const next = jest.fn();

    jest
      .spyOn(prisma, "$transaction")
      .mockImplementation(() => Promise.reject(errorMock));
    jest.spyOn(prisma.products, "findMany").mockReturnValue([]);
    jest.spyOn(prisma.products, "count").mockReturnValue(0);

    await getProducts(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Products Service - GET Template for Product", () => {
  test("GET /products/download-template - Success", async () => {
    const res = await request(server)
      .get("/products/download-template")
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(200);
    expect(res.type).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  });

  test("GET /products - Next Error", async () => {
    const req = { query: {} };
    const res = {};
    const next = jest.fn();
    const errorMock = new Error("Test Error");
    const templatesDirectory = "invalid/path/to/templates";
    const filePath = path.join(templatesDirectory, "template_product.xlsx");

    await downloadTemplateProduct(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("Products Service - GET Products By ID", () => {
  beforeEach(async () => {
    product = await prisma.products.create({
      data: {
        name: "Good Day test",
        description: "Minuman bersoda",
        qty: 10,
        price: 8000,
        TagId: 1,
      },
    });

    idMock = product.id;
  });

  test("GET /products/{id} - Success", async () => {
    const res = await request(server)
      .get(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", 200);
    expect(res.body).toHaveProperty("status", "SUCCESS GET PRODUCT");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty("id", idMock);

    await prisma.products.delete({ where: { id: idMock } });
  });

  test("GET /products/{id} - Failed - id invalid", async () => {
    const res = await request(server)
      .get(`/products/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", 404);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });
});

describe("Products Service - Update Products Image", () => {
  const filePath =
      "D:/coding/project/restapi-express-api/public/images/579b2d647acd954886ab1aa55032e66e.jpg",
    invalidFilePath =
      "D:/coding/project/restapi-express-api/public/templates/template_product.xlsx",
    BigSizeFilePath =
      "D:/coding/project/restapi-express-api/temp/Snake_River_(5mb).jpg";

  beforeEach(async () => {
    product = await prisma.products.create({
      data: {
        name: "Good Day test",
        description: "Minuman bersoda",
        qty: 10,
        price: 8000,
        TagId: 1,
      },
    });

    idMock = product.id;
  });

  test("PATCH /products/{id} - Success", async () => {
    const statusCode = 200;
    const res = await request(server)
      .patch(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .attach("image", filePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "SUCCESS UPDATE PRODUCT");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty("id", idMock);
  });

  test("PATCH /products/{id} - Failed - Invalid Id", async () => {
    const statusCode = 404;
    const res = await request(server)
      .patch(`/products/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .attach("image", filePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "DATA NOT FOUND");
  });

  test("PATCH /products/{id} - Failed - No File Upload", async () => {
    const statusCode = 400;
    const res = await request(server)
      .patch(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", "NO FILE UPLOADED");
  });

  test("PATCH /products/{id} - Failed - Wrong File", async () => {
    const statusCode = 422;
    const res = await request(server)
      .patch(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .attach("image", invalidFilePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty(
      "errorMessage",
      "format must be jpg, jpeg, png".toUpperCase()
    );
  });

  test("PATCH /products/{id} - Failed - Over Size File", async () => {
    const statusCode = 413;
    const res = await request(server)
      .patch(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`)
      .attach("image", BigSizeFilePath);

    expect(res.status).toBe(statusCode);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", statusCode);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty(
      "errorMessage",
      "size must be less than 1 MB".toUpperCase()
    );
  });

  afterEach(async () => {
    await prisma.products.delete({
      where: { id: idMock },
    });
  });
});

describe("Products Service - Delete Products", () => {
  beforeEach(async () => {
    product = await prisma.products.create({
      data: {
        name: "Coca Cola",
        description: "Minuman bersoda",
        qty: 10,
        price: 8000,
        TagId: 1,
      },
    });

    idMock = product.id;
  });

  test("DELETE /products/{id} - Success", async () => {
    const res = await request(server)
      .delete(`/products/${idMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", 200);
    expect(res.body).toHaveProperty("status", "SUCCESS DELETE PRODUCT");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("data", expect.any(Object));
    expect(res.body.payload.data).toHaveProperty("id", idMock);
  });
});

describe("Products Service - Delete Products", () => {
  beforeEach(async () => {
    product = await prisma.products.create({
      data: {
        name: "Coca Cola",
        description: "Minuman bersoda",
        qty: 10,
        price: 8000,
        TagId: 1,
      },
    });

    idMock = product.id;
  });

  test("DELETE /products/{id} - Failed - Invalid id", async () => {
    const res = await request(server)
      .delete(`/products/${idInvalidMock}`)
      .set("Authorization", `Bearer ${accessTokenMock}`);
    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("statusCode", 404);
    expect(res.body).toHaveProperty("status", "ERROR");
    expect(res.body).toHaveProperty("payload", expect.any(Object));
    expect(res.body.payload).toHaveProperty("errorMessage", expect.any(String));
  });

  afterEach(async () => {
    await prisma.products.delete({
      where: { id: idMock },
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
