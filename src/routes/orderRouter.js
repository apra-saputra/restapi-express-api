import { Router } from "express";
import OrderControl from "../controller/orderControl.js";

const route = Router();

route.get("/", OrderControl.getOrders);
route.post("/", OrderControl.createOrder);
route.patch("/actions", OrderControl.actionOrder);
route.get("/:id", OrderControl.getOrdersById);

export default route;
