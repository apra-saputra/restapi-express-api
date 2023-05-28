import { PrismaClient } from "@prisma/client";
import path from "path";
import * as XLSX from "xlsx";
import response from "../helpers/response.js";
import { getTotal } from "../helpers/utils.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      let { userId } = req.query;
      let { limit, skip } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(skip) : 0;

      if (!userId || isNaN(Number(userId)))
        throw { name: "CUSTOM", message: "User is Needed" };

      let option = {
        AuthorId: Number(userId),
      };

      const [orders, totalOrders] = await prisma.$transaction([
        prisma.orders.findMany({
          skip,
          take: limit,
          where: option,
          include: {
            ProductOrders: { include: { Stages: true, Products: true } },
          },
        }),
        prisma.orders.count({ where: option }),
      ]);

      response(res, 200, "SUCCESS GET ORDERS", {
        data: orders,
        count: totalOrders,
        limit,
        skip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrdersById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await prisma.orders.findUnique({
        where: { id: Number(id) },
        include: {
          ProductOrders: {
            include: {
              Products: { include: { Tags: true } },
              Stages: { include: { Position: true } },
            },
          },
          Author: true,
        },
      });

      if (!data) throw { name: "NOT_FOUND" };

      response(res, 200, "SUCCESS GET ORDER", { data });
    } catch (error) {
      next(error);
    }
  }

  static async getNeedAction(req, res, next) {
    try {
      const { userId } = req.query;

      const order = await prisma.productOrders.findFirst({
        where: { Stages: { PositionId: Number(userId) } },
        include: { Orders: true, Stages: true, Products: true },
      });

      response(res, 200, "SUCCESS GET ORDER NEED APPROVE", { data: order });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { userId } = req.query;
      const { workflowId } = req.body;

      if (!req.files || !req.files.docs)
        throw { name: "CUSTOM", code: 404, message: "NO FILE UPLOADED" };

      const { docs } = req.files;
      const extention = path.extname(docs.name);

      // validation extention
      const validationExt = [".xlsx", ".xls"];

      if (!validationExt.includes(extention.toLowerCase()))
        throw {
          name: "CUSTOM",
          code: 422,
          message: "format must be xlsx, xls",
        };

      const workbook = XLSX.read(docs.data, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).splice(1);

      if (!data.length) throw { name: "NOT_FOUND" };

      const { invalidIndexes, isValid } = await validateTagIds(
        data.map((item) => item[1])
      );

      if (!isValid)
        throw {
          name: "CUSTOM",
          code: 400,
          message: `INVALID TAGID NUMBER ${invalidIndexes}`,
        };

      const workflow = await prisma.workflows.findUnique({
        where: { id: Number(workflowId) },
        include: { Positions: { include: { Users: true } }, Stages: true },
      });

      // validation workflow

      if (!workflow || workflow.Positions.id !== Number(userId))
        throw { name: "CUSTOM", code: 403, message: "FORBIDEN" };

      // creating transaction

      const result = await transactionCreation(
        data.map((rows) => {
          const obj = {
            TagId: rows[1],
            name: rows[2],
            qty: rows[3],
            price: rows[4],
            description: rows[5],
            statusOrder: workflow.Stages.state,
          };
          return obj;
        }),
        Number(userId),
        Number(workflow.StageId)
      );

      response(res, 201, "SUCCESS CREATE ORDER", result);
    } catch (error) {
      console.error(error);
      await prisma.$disconnect();
      next(error);
    }
  }

  static async actionOrder(req, res, next) {
    try {
      // orderid dikirim array of id yang idnya berisi dari order
      // dikirimkan lewat body

      // payload = [id, id, id]
      const { userId } = req.query;
      const { payload, actionId } = req.body;

      const data = JSON.parse(payload);

      if (!payload.length)
        throw { name: "CUSTOM", code: 404, message: "NO ORDER UPLOAD" };

      const workflow = await prisma.workflows.findUnique({
        where: { id: Number(actionId) },
        include: { Positions: { include: { Users: true } }, Stages: true },
      });

      // validation workflow
      if (!workflow || workflow.Positions.id !== Number(userId))
        throw { name: "CUSTOM", code: 403, message: "FORBIDEN" };

      const result = await transactionAction(data, workflow);

      console.log({ result });

      response(res, 200, "SUCCESS UPDATE ORDER", { message: workflow.message });
    } catch (error) {
      next(error);
    }
  }

  static async modifyOrder(req, res, next) {}

  static async cancelOrder(req, res, next) {}
}

async function transactionCreation(
  payload = [{}],
  userid = "" || 0,
  workflowId = "" || 0
) {
  return await prisma.$transaction(async (prisma) => {
    let products = [];

    payload.forEach(async (item) => {
      const createdProduct = await prisma.products.create({
        data: item,
      });
      products.push(createdProduct);
    });

    const orders = await prisma.orders.create({
      data: {
        AuthorId: Number(userid),
        qty: getTotal(payload, "qty"),
        totalAmount: getTotal(payload, "price") * getTotal(payload, "qty"),
      },
    });

    const dataProductOrder = products.map((product) => {
      return {
        ProductId: product.id,
        OrderId: orders.id,
        StageId: Number(workflowId),
      };
    });

    await prisma.productOrders.createMany({
      data: dataProductOrder,
    });

    return dataProductOrder;
  });
}

async function transactionAction(orderIdInArray, workflow) {
  return await prisma.$transaction(async (prisma) => {
    const productOrder = await prisma.productOrders.findMany({
      where: { OrderId: { in: orderIdInArray } },
    });

    let productId = [];

    productOrder.forEach((item) => {
      productId.push(item.ProductId);
    });

    await prisma.products.updateMany({
      where: { id: { in: productId } },
      data: { statusOrder: workflow.Stages.state },
    });

    await prisma.productOrders.updateMany({
      where: { OrderId: { in: orderIdInArray } },
      data: { StageId: Number(workflow.Stages.id) },
    });

    // await prisma.orders.updateMany({
    //   where: { id: { in: orderIdInArray } },
    //   data: { StageId: workflow.Stages.id },
    // });

    return "SUCCESS UPDATE";
  });
}

async function validateTagIds(tagIds = []) {
  try {
    const existingTags = await prisma.tags.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });

    const existingTagIds = existingTags.map((tag) => tag.id);
    const invalidTagIndexes = tagIds.reduce((invalidIndexes, tagId, index) => {
      if (!existingTagIds.includes(tagId)) {
        invalidIndexes.push(index);
      }
      return invalidIndexes;
    }, []);

    return {
      isValid: invalidTagIndexes.length === 0,
      invalidIndexes: invalidTagIndexes ? Number(invalidTagIndexes) + 1 : 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal memvalidasi tag berdasarkan ID.");
  }
}
