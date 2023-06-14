import { PrismaClient } from "@prisma/client";
import path from "path";
import * as XLSX from "xlsx";
import response from "../../helpers/response.js";
import {
  transactionAction,
  transactionCreation,
  validateTagIds,
} from "./utils.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      const userId = req.user.id;

      // const userId = 3; // for testing
      let { limit, skip, typeService = "owner" } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(skip) : 0;

      /**
       * typeServie = "owner"
       * typeServie = "done"
       * typeServie = "approval"
       * typeServie = "modify"
       */
      let option = {};

      switch (typeService) {
        case "done":
          option.ProductOrders = { every: { Stages: { state: "DONE" } } };
          break;
        case "owner":
          option.AuthorId = Number(userId);
          option.ProductOrders = { none: { Stages: { state: "DONE" } } };
          break;
        case "approval":
          option.ProductOrders = {
            every: { Stages: { PositionId: Number(userId) } },
            none: { Stages: { state: "DONE" } },
          };
          break;
        case "modify":
          // const stage = 4
          option.ProductOrders = {
            every: { Stages: { PositionId: Number(userId) } },
            every: { Stages: { id: 4 } },
          };
          break;
      }

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

      response(
        res,
        200,
        `SUCCESS GET ORDERS, TYPE: ${typeService.toUpperCase()}`,
        {
          data: orders,
          count: totalOrders,
          limit,
          skip,
        }
      );
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

  static async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
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
          message: "FORMAT MUST BE XLSX, XLS",
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

      // creating transaction Products, Orders, RELATION TABLE
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

      response(res, 201, "SUCCESS CREATE ORDER", { data: result });
    } catch (error) {
      console.error(error);
      await prisma.$disconnect();
      next(error);
    }
  }

  static async actionOrder(req, res, next) {
    try {
      /**
       * orderid dikirim array of id yang idnya berisi dari order
       * dikirimkan lewat body
       * example => payload = [id, id, id]
       */

      const userId = req.user.id;
      // const userId = 2; // for testing
      const { payload, actionId } = req.body;

      const data = JSON.parse(payload);

      if (!payload.length)
        throw { name: "CUSTOM", code: 404, message: "NO ORDER SENT" };

      const workflow = await prisma.workflows.findUnique({
        where: { id: Number(actionId) },
        include: { Positions: { include: { Users: true } }, Stages: true },
      });

      // validation workflow
      if (!workflow || workflow.Positions.id !== Number(userId))
        throw { name: "CUSTOM", code: 403, message: "FORBIDEN" };

      const result = await transactionAction(data, workflow);

      console.log({ result });

      response(res, 200, "SUCCESS ACTION ORDER", {
        data: { message: workflow.message },
      });
    } catch (error) {
      next(error);
    }
  }
}
