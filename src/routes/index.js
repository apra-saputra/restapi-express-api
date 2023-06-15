import { Router } from "express";
import authentication from "../middleware/authentication.js";
import AuthControl from "../controller/authControl.js";
import productRoute from "./productRouter.js";
import orderRoute from "./orderRouter.js";
import tagRoute from "./tagRouter.js";

const route = Router();

route.get("/", (_, res) => {
  res.send("service ready...🚀");
});

// Auth
route.post("/login", AuthControl.requestOTP);
route.post("/confirm-otp", AuthControl.confirmOtp);
// route protect access
route.use(authentication);
route.patch("/logout", AuthControl.logout);

// route from route
route.use("/orders", orderRoute);
route.use("/products", productRoute);
route.use("/tags", tagRoute);

export default route;
