import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      let { limit, skip, userid } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(limit) : 0;

      if (!userid || isNaN(Number(userid)))
        throw { name: "CUSTOM", message: "User is Needed" };

      let option = {
        OwnerId: Number(userid),
      };

      const order = await prisma.orders.findMany({
        skip,
        take: limit,
        where: option,
      });

      const count = await prisma.orders.count({
        where: option,
      });

      response(res, 200, "SUCCESS GET ORDERS", { data: order, count });
    } catch (error) {
      next(error);
    }
  }

  static async getOrdersById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await prisma.orders.findUnique({
        where: { id: Number(id) },
        include: { Products: { include: { Tags: true } }, Senders: true },
      });

      response(res, 200, "SUCCESS GET ORDER", { data });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {}

  static async modifyOrder(req, res, next) {}

  static async cancelOrder(req, res, next) {}
}
