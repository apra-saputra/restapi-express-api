import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

/**
 * @swagger
 * /orders:
 *     get:
 *       summary: Mendapatkan semua file order
 *       tags: [Orders]
 *       parameter:
 *     responses:
 *       200:
 *          description: SUCCESS GET ORDERS, TYPE {typeService}
 *       500:
 *         description: INTERNAL SERVER ERROR
 */
route.get("/", OrderControl.getOrders);

/**
 * @swagger
 * /orders:
 *    post:
 *       summary: Untuk membuat order dan product
 *       tags: [Orders]
 *       requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *             required:
 *               - username
 */
route.post("/", OrderControl.createOrder);

// /**
//  * @swagger
//  * /need-actions:
//  *   get:
//  *    summary: Untuk mendapatkan Order yang akan di approve
//  *    tags: [Orders]
//  */
// route.get("/need-actions", OrderControl.getNeedAction);

/**
 * @swagger
 * /actions:
 *   patch:
 *    summary: untuk mengaprove order yang didapatkan
 *    tags: [Orders]
 */
route.patch("/actions", OrderControl.actionOrder);

/**
 * @swagger
 * /{id}:
 *   get:
 *    summary: untuk mendapatkan Order detail
 *    tags: [Orders]
 */
route.get("/:id", OrderControl.getOrdersById);

// route.put("/:id", OrderControl.modifyOrder);
// route.delete("/:id", OrderControl.cancelOrder);

export default route;
