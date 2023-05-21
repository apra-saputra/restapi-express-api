import { Router } from "express";
import AuthControl from "../controller/authControl.js";
import productRoute from "./productRouter.js";

const route = Router();

route.get("", (req, res) => {
  res.send("service ready...🚀");
});

//Swagger post request-otp
/**
 * @swagger
 * /request-otp:
 *   post:
 *     summary: Login pengguna dan menghasilkan kode OTP
 *     tags:
 *       - users
 *     description: Gunakan API ini untuk masuk ke sistem pengguna dan menghasilkan kode OTP
 *     requestBody:
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
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email pengguna
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Kesalahan server internal
 */
route.post("/request-otp", AuthControl.requestOTP);
route.post("/confirm-otp", AuthControl.confirmOtp);

route.use("/products", productRoute);

export default route;
