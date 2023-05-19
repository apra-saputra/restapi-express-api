import { Router } from "express";
import AuthControl from "../controller/authControl.js";
import productRoute from "./productRouter.js";

const route = Router();

route.get("", (req, res) => {
  res.send("service ready...🚀");
});

//Swagger post Login
/**
 * @swagger
 * /request-otp:
 *   post:
 *     summary: login user
 *     tags:
 *       - users
 *     description: Untuk masuk kedalam sistem user di wajibkan untuk login untuk membuat kode otp
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: input email user
 *         schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: SUCCESS OTP SENT
 *       404:
 *         description: DATA NOT FOUND
 *       500:
 *         description: INTERNAL SERVER ERROR
 */
route.post("/request-otp", AuthControl.requestOTP);

route.use("/products", productRoute);

export default route;
