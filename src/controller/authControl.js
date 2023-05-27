import { PrismaClient } from "@prisma/client";
import { signToken } from "../helpers/jwt.js";
import { generateOtp, validateExpiredOtp } from "../helpers/otp.js";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class AuthControl {
  static async requestOTP(req, res, next) {
    try {
      // console.log({req})
      const { username } = req.body;

      if (!username) throw { name: "USERNAME_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { username } });

      if (!data.id) throw { name: "NOT_FOUND" };

      const otp = generateOtp().toString();

      console.log(otp);

      await prisma.users.update({
        where: { id: data.id },
        data: { otp },
      });

      // otp should send to email or personal message

      response(res, 200, "SUCCESS OTP SENT", { email: data.email });
    } catch (error) {
      next(error);
    }
  }

  static async confirmOtp(req, res, next) {
    try {
      const { email, OTP } = req.body;

      if (!email || !OTP) throw { name: "EMAIL_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { email } });

      if (data.otp !== OTP.toString()) throw { name: "INVALID_LOGIN" };

      if (validateExpiredOtp(data))
        throw { name: "INVALID_LOGIN", message: "OTP IS EXPIRED" };

      const token = signToken({ id: data.id, email: data.email });
      response(res, 200, "SUCCESS OTP CONFIRM", { accessToken: token });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      await prisma.users.update({
        where: { id: Number(req.user.id) },
        data: { otp: null },
      });

      response(res, 200, "SUCCESS LOGOUT");
    } catch (error) {
      next(error);
    }
  }
}
