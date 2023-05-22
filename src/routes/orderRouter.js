import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

route.get("/", OrderControl.getOrders);
route.get("/:id", OrderControl.getOrdersById);
route.post("/", OrderControl.createOrder);
route.put("/:id", OrderControl.modifyOrder);
route.delete("/:id", OrderControl.cancelOrder);

export default route;
