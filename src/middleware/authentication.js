import { verifyToken } from "../helpers/jwt.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw { name: "UNAUTHORIZE" };

    const accessToken = authorization.split(" ")[1];

    const payload = verifyToken(accessToken);

    if (!payload) throw { name: "UNAUTHORIZE" };

    const user = await prisma.positions.findUnique({
      where: { UserId: Number(payload.id) },
      include: { Users: true },
    });

    if (!user) throw { name: "UNAUTHORIZE" };

    req.user = {
      id: user.id,
      email: user.Users.email,
      position: user.position,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export default authentication;
