const { PrismaClient } = require("@prisma/client");
const response = require("../helpers/response");

const prisma = new PrismaClient();

module.exports = class ProductControl {
  static async getProducts(req, res, next) {
    try {
      const data = await prisma.products.findMany();
      response(res, 200, "SUCCESS GET PRODUCTS", data);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const data = await prisma.products.findUnique({
        where: { id: req.params.id },
      });
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
};
