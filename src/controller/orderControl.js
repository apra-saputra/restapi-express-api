import { PrismaClient } from "@prisma/client";
import path from "path";
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

  static async createOrder(req, res, next) {
    try {
      const { userid, actionid } = req.query;
      const { ProductId, amount } = req.body;

      const workflowValid = await prisma.workflows.findUnique({
        where: { id: Number(actionid) },
        include: {
          Senders: { include: { Users: true } },
          Validaters: { include: { Users: true } },
          Flows: true,
        },
      });

      if (workflowValid.OwnerUserId !== Number(userid))
        throw { name: "CUSTOM", code: 401, message: "UNAUTHORIZATION" };

      if (!req.files)
        throw { name: "CUSTOM", code: 404, message: "NO FILE UPLOADED" };

      const { file } = req.files;
      const { name: imgName, size: imgSize } = file;
      const fileType = path.extname(imgName);
      const fileName = file.md5 + fileType;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      // set validation
      const fileTypeValidation = [".jpg", ".jpeg", ".png"];
      const sizeValidation = 3;

      // validation for image type
      if (!fileTypeValidation.includes(fileType.toLowerCase()))
        throw {
          name: "CUSTOM",
          code: 422,
          message: "format must be jpg, jpeg, png",
        };

      if (imgSize > sizeValidation * 1024 * 1024)
        throw {
          name: "CUSTOM",
          code: 422,
          message: `size must be less than ${sizeValidation}MB`,
        };

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) throw err;

        const orders = await prisma.orders.create({
          data: {
            ProductId: product.id,
            OwnerId: Number(userid),
            qty: Number(qty),
            message: workflowValid.Flows.name,
            FlowId: 1,
            totalAmount: Number(amount),
            locked: true,
            FlowId: Number(actionid),
          },
        });

        // console.log(result);
        res.send("OK");
      });
    } catch (error) {
      next(error);
    }
  }

  static async modifyOrder(req, res, next) {}

  static async cancelOrder(req, res, next) {}
}
