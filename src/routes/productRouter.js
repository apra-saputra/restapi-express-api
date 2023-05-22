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

//Swagger get Product
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Mendapatkan produk berdasarkan ID
 *     tags:
 *       - product
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

export default route;
