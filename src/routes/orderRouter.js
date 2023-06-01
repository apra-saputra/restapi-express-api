import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

//Swagger get Orders
/**
 * @swagger
 * /orders?{typeService}:
 *     get:
 *       summary: Mendapatkan semua file order
 *       tags: [Orders]
 *       parameter:
 *       - in: query
 *         name: typeService
 *         schema:
 *           type: string
 *           enum: [owner, done, approval, modify]
 *         required: true
 *         description: Filter order berdasarkan jenis layanan
 *     responses:
 *       200:
 *         description: SUCCESS GET ORDERS, TYPE {typeService}
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
//  * /orders/need-actions:
//  *   get:
//  *    summary: Untuk mendapatkan Order yang akan di approve
//  *    tags: [Orders]
//  */
// route.get("/need-actions", OrderControl.getNeedAction);

/**
 * @swagger
 * /orders/actions:
 *   patch:
 *    summary: untuk mengaprove order yang didapatkan
 *    tags: [Orders]
 */
route.patch("/actions", OrderControl.actionOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *    summary: untuk mendapatkan Order detail
 *    tags: [Orders]
 */
route.get("/:id", OrderControl.getOrdersById);

// route.delete("/:id", OrderControl.cancelOrder);

export default route;
