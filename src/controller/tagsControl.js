import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class TagControl {
  static async getTags(_, res, next) {
    try {
      const data = await prisma.tags.findMany({ where: { active: true } });

      response(res, 200, "SUCCESS GET TAGS", { data });
    } catch (error) {
      next(error);
    }
  }

  static async getTagById(req, res, next) {
    try {
      const data = await prisma.tags.findUnique({
        where: { id: Number(req.params.id) },
      });

      response(res, 200, "SUCCESS GET TAG", { data });
    } catch (error) {
      next(error);
    }
  }

  static async updateTag(req, res, next) {
    try {
      const { name } = req.body;

      const data = await prisma.tags.update({
        where: { id: Number(req.params.id) },
        data: { name },
      });

      response(res, 200, "SUCCESS UPDATE TAG", { data });
    } catch (error) {
      next(error);
    }
  }
}
