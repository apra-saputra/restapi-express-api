import { PrismaClient } from "@prisma/client";
import response from "../helpers/response.js";
import path from "path";

const prisma = new PrismaClient();

export default class ProductControl {
  static async getProducts(req, res, next) {
    try {
      let { limit, skip } = req.query;

      limit = limit ? Number(limit) : 10;
      skip = skip ? Number(skip) : 0;

      const [products, totalProducts] = await prisma.$transaction([
        prisma.products.findMany({ skip, take: limit }),
        prisma.products.count(),
      ]);

      response(res, 200, "SUCCESS GET PRODUCTS", {
        count: totalProducts,
        data: products,
        limit,
        skip,
      });
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
