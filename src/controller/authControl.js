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

      await prisma.users.update({
        where: { id: data.id },
        data: { otp: toString(otp) },
      });

      // otp should send to email or personal whatsapp

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

      if (data.otp !== OTP) throw { name: "INVALID_LOGIN" };

      if (validateExpiredOtp(data)) throw { name: "INVALID_LOGIN" };

      const token = signToken({ id: data.id, email: data.email });
      response(res, 200, "SUCCESS OTP CONFIRM", token);
    } catch (error) {
      next(error);
    }
  }
}

function generateOtp() {
  const otp = Math.round(Math.random() * 1000000);
  return otp;
}

function validateExpiredOtp(data) {
  const nowTime = new Date();
  const dataTime = new Date(data.updatedAt);
  const setTime = 5 * 60; // in minutes

  const timeDifferenceInSeconds = Math.floor(
    (nowTime.getTime() - dataTime.getTime()) / 1000 // in second
  );

  if (timeDifferenceInSeconds < setTime) {
    return true;
  }
  return false;
}
