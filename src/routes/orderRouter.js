import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

/**
 * @swagger
 * /orders:
 *  get:
 *    summary: Mendapatkan semua file order
 *    tags: [Orders]
 *
 */
route.get("/", OrderControl.getOrders);

/**
 * @swagger
 * /orders:
 *  post:
 *    summary: Untuk membuat order dan product
 *    tags: [Orders]
 */
route.post("/", OrderControl.createOrder);

/**
 * @swagger
 * /need-approve/{id}:
 *  get:
 *    summary: Untuk mendapatkan Order yang akan di approve
 *    tags: [Orders]
 */
route.get("/need-approve", OrderControl.getNeedApprove);

/**
 * @swagger
 * /actions:
 *  get:
 *    summary: Untuk mendapatkan Order yang akan di approve
 *    tags: [Orders]
 */
route.put("/actions", OrderControl.actionOrder);

/**
 * @swagger
 * /{id}:
 *  get:
 *    summary: untuk mendapatkan Order detail
 *    tags: [Orders]
 */
route.get("/:id", OrderControl.getOrdersById);

// route.put("/:id", OrderControl.modifyOrder);
// route.delete("/:id", OrderControl.cancelOrder);

export default route;
