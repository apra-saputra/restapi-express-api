import { PrismaClient } from "@prisma/client";
import path from "path";
import * as XLSX from "xlsx";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class OrderControl {
  static async getOrders(req, res, next) {
    try {
      let { limit, skip, userid } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(skip) : 0;

      if (!userid || isNaN(Number(userid)))
        throw { name: "CUSTOM", message: "User is Needed" };

      let option = {
        AuthorId: Number(userid),
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

  static async createOrder(req, res, next) {
    try {
      const { workflowId, userid } = req.body;

      /**
       * creating product
       */
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

      // await prisma.orders.createMany({ data: { AuthorId: userid,  } });

      // const products = await prisma.products.createMany({
      //   data: data.map((rows) => {
      //     const obj = {
      //       TagId: rows[1],
      //       name: rows[2],
      //       qty: rows[3],
      //       price: rows[4],
      //       description: rows[5],
      //     };
      //     return obj;
      //   }),
      // });

      // creating product end

      response(res, 200, "SUCCESS CREATE ORDER");
    } catch (error) {
      next(error);
    }
  }

  // static async createOrder(req, res, next) {
  //   try {
  //     const { userid, actionid } = req.query;
  //     const { ProductId, amount } = req.body;

  //     const workflowValid = await prisma.workflows.findUnique({
  //       where: { id: Number(actionid) },
  //       include: {
  //         Senders: { include: { Users: true } },
  //         Validaters: { include: { Users: true } },
  //         Flows: true,
  //       },
  //     });

  //     if (workflowValid.OwnerUserId !== Number(userid))
  //       throw { name: "CUSTOM", code: 401, message: "UNAUTHORIZATION" };

  //     if (!req.files)
  //       throw { name: "CUSTOM", code: 404, message: "NO FILE UPLOADED" };

  //     const { file } = req.files;
  //     const { name: imgName, size: imgSize } = file;
  //     const fileType = path.extname(imgName);
  //     const fileName = file.md5 + fileType;
  //     const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  //     // set validation
  //     const fileTypeValidation = [".jpg", ".jpeg", ".png"];
  //     const sizeValidation = 3;

  //     // validation for image type
  //     if (!fileTypeValidation.includes(fileType.toLowerCase()))
  //       throw {
  //         name: "CUSTOM",
  //         code: 422,
  //         message: "format must be jpg, jpeg, png",
  //       };

  //     if (imgSize > sizeValidation * 1024 * 1024)
  //       throw {
  //         name: "CUSTOM",
  //         code: 422,
  //         message: `size must be less than ${sizeValidation}MB`,
  //       };

  //     file.mv(`./public/images/${fileName}`, async (err) => {
  //       if (err) throw err;

  //       const orders = await prisma.orders.create({
  //         data: {
  //           ProductId: product.id,
  //           OwnerId: Number(userid),
  //           qty: Number(qty),
  //           message: workflowValid.Flows.name,
  //           FlowId: 1,
  //           totalAmount: Number(amount),
  //           locked: true,
  //           FlowId: Number(actionid),
  //         },
  //       });

  //       // console.log(result);
  //       res.send("OK");
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async modifyOrder(req, res, next) {}

  static async cancelOrder(req, res, next) {}
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
