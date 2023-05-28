import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class WorkflowControl {
  static async getWorkflows(req, res, next) {
    try {
      const { userId } = req.params;

      const data = await prisma.workflows.findMany({
        where: { ApproverId: Number(userId) },
        include: {
          Positions: { include: { Users: true } },
        },
      });

      response(res, 200, "SUCCESS GET WORKFLOWS", { data });
    } catch (error) {
      next(error);
    }
  }
}
