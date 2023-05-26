import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";
import path from "path";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export default class ProductControl {
  static async getProducts(_, res, next) {
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

  static async createProduct(req, res, next) {
    try {
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

      const products = await prisma.products.createMany({
        data: data.map((rows) => {
          const obj = {
            TagId: rows[1],
            name: rows[2],
            qty: rows[3],
            price: rows[4],
            description: rows[5],
            statusOrder: "SATTLE",
          };
          return obj;
        }),
      });

      response(res, 200, "SUCCESS CREATE PRODUCT");
    } catch (error) {
      next(error);
    }
  }

  static async downloadTemplateProduct(req, res, next) {
    try {
      const templatesDirectory = path.join(`public/templates`);
      const filePath = path.join(templatesDirectory, "template_product.xlsx");

      res.download(filePath, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateImageProduct(req, res, next) {
    try {
      const products = await prisma.products.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!products) throw { name: "NOT_FOUND" };

      if (!req.files || !req.files.image)
        throw { name: "CUSTOM", code: 404, message: "NO FILE UPLOADED" };

      const { image } = req.files;
      const extention = path.extname(image.name);
      const imgSize = image.size;
      const fileName = image.md5 + extention;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      // set validation
      const fileTypeValidation = [".jpg", ".jpeg", ".png"];
      const sizeValidation = 3;

      if (!fileTypeValidation.includes(extention.toLowerCase()))
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

      image.mv(`./public/images/${fileName}`, async (err) => {
        if (err) throw err;

        const data = await prisma.products.update({
          where: { id: products.id },
          data: { imgUrl: url },
        });
        response(res, 200, "SUCCESS UPDATE PRODUCT", data);
      });
    } catch (error) {
      next(error);
    }
  }

  static async hardDeleteProduct(req, res, next) {
    try {
      const data = await prisma.products.delete({
        where: { id: Number(req.params.id) },
      });

      if (!data) throw { name: "NOT_FOUND" };

      response(res, 200, "SUCCESS DELETE PRODUCT", data);
    } catch (error) {
      next(error);
    }
  }
}
