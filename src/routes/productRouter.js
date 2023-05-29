import { Router } from "express";

import ProductControl from "../controller/productControl.js";

const route = Router();

//Swagger get Products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Mendapatkan produk yang tersedia
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: SUCCESS GET PRODUCTS
 *       500:
 *         description: INTERNAL SERVER ERROR
 */
route.get("/", ProductControl.getProducts);

/**
 * @swagger
 * /products/download-template:
 *  get:
 *    summary: Mengunduh file template
 *    tags: [Products]
 *
 */
route.get("/download-template", ProductControl.downloadTemplateProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Mendapatkan produk berdasarkan ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk yang akan ditemukan
 *     responses:
 *       200:
 *         description: SUCCESS GET PRODUCT
 *       404:
 *         description: DATA NOT FOUND
 *       500:
 *         description: INTERNAL SERVER ERROR
 */
route.get("/:id", ProductControl.getProductById);

/**
 * @swagger
 * /products/{id}:
 *    patch:
 *      summary: mengupdate gambar dengan mengirimkan file ke api
 *      tags: [Products]
 *
 */
route.patch("/:id", ProductControl.updateImageProduct);

/**
 * @swagger
 * /products/{id}:
 *    delete:
 *      summary: menghapus product secara hard delete
 *      tags: [Products]
 */
route.delete("/:id", ProductControl.hardDeleteProduct);

export default route;
