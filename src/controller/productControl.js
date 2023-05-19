import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class ProductControl {
  static async getProducts(req, res, next) {
    try {
      const data = await prisma.products.findMany();

      if (!data.length) throw { name: "NOT_FOUND" };

      response(res, 200, "SUCCESS GET PRODUCTS", data);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const data = await prisma.products.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!data) throw { name: "NOT_FOUND" };

      response(res, 200, "SUCCESS GET PRODUCT", data);
    } catch (error) {
      next(error);
    }
  }

  static async updateInactiveProduct(req, res, next) {
    try {
      const data = await prisma.products.update({
        where: { id: req.params.id },
        data: {},
      });

      response(res, 200, "SUCCESS UPDATE PRODUCT", data);
    } catch (error) {
      next(error);
    }
  }
}
