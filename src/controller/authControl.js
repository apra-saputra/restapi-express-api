const { PrismaClient } = require("@prisma/client");
const response = require("../helpers/response");
const prisma = new PrismaClient();

module.exports = class AuthControl {
  static async login(req, res, next) {
    try {
      const { email } = req.body;
      const data = await prisma.users.findUnique({ where: { email } });

      response(res, 200, "SUCCESS LOGIN", token);
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
};
