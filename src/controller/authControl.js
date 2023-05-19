import { PrismaClient } from "@prisma/client";
import { signToken } from "../helpers/jwt.js";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class AuthControl {
  static async requestOTP(req, res, next) {
    try {
      const { username } = req.body;

      if (!username) throw { name: "USERNAME_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { username } });

      if (!data.id) throw { name: "NOT_FOUND" };

      const otp = generateOtp();

      console.log({ otp });

      await prisma.users.update({
        where: { id: data.id },
        data: { otp: toString(otp) },
      });

      // otp should send to email or personal whatsapp

      response(res, 200, "SUCCESS LOGIN/ OTP SENT", { email: data.email });
    } catch (error) {
      next(error);
    }
  }

  static async sendOtp(req, res, next) {
    try {
      const { email, OTP } = req.body;

      if (!email || !OTP) throw { name: "EMAIL_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { email } });

      if (data.otp !== OTP) throw { name: "INVALID_LOGIN" };

      const token = signToken({ id: data.id, email: data.email });
      response(res, 200, "SUCCESS LOGIN", token);
    } catch (error) {
      next(error);
    }
  }
}

// function generateOtp() {
//   const otp = Math.round(Math.random() * 1000000);
//   return otp;
// }
