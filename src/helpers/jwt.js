import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JSONWEBTOKEN_KEY;

export const signToken = ({ id, username, expIn }) => {
  return jwt.sign({ id, username }, secretKey, { expiresIn: expIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
