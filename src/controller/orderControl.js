import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      let { limit, skip } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(limit) : 0;

      const { userid } = req.params;

      console.log(isNaN(Number(userid)), userid, "userid");

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

  static async getOrdersById(req, res, next) {}

  static async createOrder(req, res, next) {}

  static async modifyOrder(req, res, next) {}

  static async cancelOrder(req, res, next) {}
}
