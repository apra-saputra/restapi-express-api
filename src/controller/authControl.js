import { PrismaClient } from "@prisma/client";
import { signToken } from "../helpers/jwt.js";
import { generateOtp, validateExpiredOtp } from "../helpers/otp.js";
import response from "../helpers/response.js";

const prisma = new PrismaClient();

export default class AuthControl {
  static async requestOTP(req, res, next) {
    try {
      const { username } = req.body;

      if (!username) throw { name: "USERNAME_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { username } });

      if (!data) throw { name: "NOT_FOUND" };

      const OTP = generateOtp();

      // Show OTP On Terminal For Debug
      console.log({ OTP });

      await prisma.users.update({
        where: { id: data.id },
        data: { otp: OTP.toString() },
      });

      // OTP Should Send to Personal User
      response(res, 200, "SUCCESS SENT OTP", { email: data.email });
    } catch (error) {
      next(error);
    }
  }

  static async confirmOtp(req, res, next) {
    try {
      const { email, OTP } = req.body;

      if (!email) throw { name: "EMAIL_IS_REQUIRED" };

      if (!OTP) throw { name: "OTP_IS_REQUIRED" };

      const data = await prisma.users.findUnique({ where: { email } });

      if (data.otp !== OTP.toString()) throw { name: "INVALID_LOGIN" };

      if (validateExpiredOtp(data))
        throw { name: "CUSTOM", code: 419, message: "OTP IS EXPIRED" };

      const workflow = await prisma.workflows.findMany({
        where: { Positions: { Users: { id: Number(data.id) } } },
        include: { Stages: true },
      });

      const token = signToken({
        id: data.id,
        username: data.username,
        expIn: 15 * 1000 * 60,
      });

      response(res, 200, "SUCCESS CONFIRM OTP", {
        accessToken: token,
        exp: 15 * 60 * 1000,
        access: workflow,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    await prisma.users.update({
      where: { id: Number(req.user.id) },
      data: { otp: null },
    });

    response(res, 200, "SUCCESS LOGOUT");
  }
}
