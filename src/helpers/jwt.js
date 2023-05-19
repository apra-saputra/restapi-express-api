import jwt from "jsonwebtoken";

const secretKey = process.env.JSONWEBTOKEN_KEY;

export const signToken = (payload = { id, username }) => {
  return jwt.sign({ id, username }, secretKey);
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
