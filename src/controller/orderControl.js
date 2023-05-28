import { PrismaClient } from "@prisma/client";
import path from "path";
import * as XLSX from "xlsx";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      let { limit, skip, userId } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(skip) : 0;

      if (!userId || isNaN(Number(userId)))
        throw { name: "CUSTOM", message: "User is Needed" };

      let option = {
        AuthorId: Number(userId),
      };

      const [orders, totalOrders] = await prisma.$transaction([
        prisma.orders.findMany({ skip, take: limit, where: option }),
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
        include: { Products: true, Author: true },
      });

      if (!data) throw { name: "NOT_FOUND" };

      response(res, 200, "SUCCESS GET ORDER", { data });
    } catch (error) {
      next(error);
    }
  }

  static async getNeedApprove(req, res, next) {
    try {
      const order = await prisma.productOrders.findMany({
        where: { Orders: { Stages: { PositionId: Number(req.params.id) } } },
        include: { Orders: { include: { Stages: true } } },
      });

      response(res, 200, "SUCCESS GET ORDER NEED APPROVE", { data: order });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { workflowId, userId } = req.body;

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

      // create product

      const payload = data.map((rows) => {
        const obj = {
          TagId: rows[1],
          name: rows[2],
          qty: rows[3],
          price: rows[4],
          description: rows[5],
          statusOrder: workflow.Stages.state,
        };
        return obj;
      });

      const result = await transactionCreation(
        payload,
        Number(userId),
        Number(workflow.id)
      );

      console.log(result);

      response(res, 201, "SUCCESS CREATE ORDER");
    } catch (error) {
      await prisma.$disconnect();
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
        StageId: Number(workflowId),
      },
    });

    console.log({ products });

    const dataProductOrder = products.map((product) => {
      return { ProductId: product.id, OrderId: orders.id };
    });

    await prisma.productOrders.createMany({
      data: dataProductOrder,
    });

    return dataProductOrder;
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

function getTotal(array = [], typeOfTotalKey = "") {
  let result = 0;

  array.forEach((item) => {
    result += Number(item[typeOfTotalKey]);
  });

  return result;
}
