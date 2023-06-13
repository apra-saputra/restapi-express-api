import { Router } from "express";
import authentication from "../middleware/authentication.js";
import AuthControl from "../controller/authControl.js";
import productRoute from "./productRouter.js";
import orderRoute from "./orderRouter.js";
import tagRoute from "./tagRouter.js";

const route = Router();

route.get("", (_, res) => {
  res.send("service ready...🚀");
});

//Swagger post login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login pengguna dan menghasilkan kode OTP
 *     tags: [Auth]
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
route.post("/login", AuthControl.requestOTP);

//Swagger post confirm-Otp
/**
 * @swagger
 * /confirm-otp:
 *   post:
 *      summary: Mengkonfirmasi OTP yang dikirimkan untuk di cek dan dibalikan berupa access token
 *      tags: [Auth]
 *
 */
route.post("/confirm-otp", AuthControl.confirmOtp);

//Swagger post logout
/**
 * @swagger
 * /logout:
 *   post:
 *      summary: Untuk menghapus akses yang diberikan
 *      tags: [Auth]
 *
 */
route.patch("/logout", AuthControl.logout);

// route protect access
route.use(authentication);

// route from route
route.use("/orders", orderRoute);
route.use("/products", productRoute);
route.use("/tags", tagRoute);

export default route;
