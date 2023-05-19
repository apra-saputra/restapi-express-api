import response from "../helpers/response.js";

const errorHandler = (error, req, res, next) => {
  console.log(error);
  let statusCode = 500;
  let status = "INTERNAL SERVER ERROR";

  const { name } = error;

  if (name === "NOT_FOUND") {
    statusCode = 404;
    status = "DATA NOT FOUND";
  }
  if (name === "EMAIL_IS_REQUIRED") {
    statusCode = 400;
    status = "EMAIL IS REQUIRED";
  }
  if (name === "USERNAME_IS_REQUIRED") {
    statusCode = 400;
    status = "USERNAME IS REQUIRED";
  }
  if (name === "INVALID_LOGIN") {
    statusCode = 401;
    status = "INVALID LOGIN";
  }

  response(res, statusCode, status);
};

export default errorHandler;
