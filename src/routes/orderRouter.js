import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

//Swagger get oOders
/**
 * @swagger
 * /orders:
 *  get:
 *    summary: Mendapatkan semua file order
 *    tags: [Orders]
 *
 */
route.get("/", OrderControl.getOrders);
route.get("/:id", OrderControl.getOrdersById);
route.post("/", OrderControl.createOrder);
route.put("/:id", OrderControl.modifyOrder);
route.delete("/:id", OrderControl.cancelOrder);

export default route;
