import { Router } from "express";

import ProductControl from "../controller/productControl.js";

const route = Router();

//Swagger get Products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Mendapatkan produk yang tersedia
 *     tags: [products]
 *     responses:
 *       200:
 *         description: SUCCESS GET PRODUCTS
 *       404:
 *         description: DATA NOT FOUND
 *       500:
 *         description: INTERNAL SERVER ERROR
 */

route.get("/", ProductControl.getProducts);

//Swagger get Download Template
/**
 * @swagger
 * /products/download-template:
 *  get:
 *    summary: Mengunduh file template
 *    tags: [products]
 *
 */
route.get("/download-template", ProductControl.downloadTemplateProduct);

//Swagger get Product
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Mendapatkan produk berdasarkan ID
 *     tags: [products]
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

//Swagger post Product
/**
 * @swagger
 * /products:
 *    post:
 *      summary: membuat product baru dari file yang dikirimkan
 *      tags: [products]
 *
 */
route.post("/", ProductControl.createProduct);

//Swagger put Image Product
/**
 * @swagger
 * /products/{id}:
 *     put:
 *      summary: mengupdate gambar dengan mengirimkan file ke api
 *      tags: [products]
 *
 */
route.put("/:id", ProductControl.updateImageProduct);

//Swagger put Image Product
/**
 * @swagger
 * /products/{id}:
 *     delete:
 *      summary: menghapus product secara hard delete
 *      tags: [products]
 *
 */
route.delete("/:id", ProductControl.hardDeleteProduct);

export default route;
