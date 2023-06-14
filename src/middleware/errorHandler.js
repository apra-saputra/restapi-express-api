import response from "../helpers/response.js";

const errorHandler = (error, req, res, next) => {
  console.log(error);
  let statusCode = 500;
  let status = "INTERNAL SERVER ERROR";

  const { name, code, message } = error;

  if (name === "NOT_FOUND") {
    statusCode = 404;
    status = "DATA NOT FOUND";
  } else if (name === "EMAIL_IS_REQUIRED") {
    statusCode = 400;
    status = "EMAIL IS REQUIRED";
  } else if (name === "OTP_IS_REQUIRED") {
    statusCode = 400;
    status = "OTP IS REQUIRED";
  } else if (name === "USERNAME_IS_REQUIRED") {
    statusCode = 400;
    status = "USERNAME IS REQUIRED";
  } else if (name === "INVALID_LOGIN") {
    statusCode = 401;
    status = "INVALID LOGIN";
  } else if (name === "UNAUTHORIZE") {
    statusCode = 403;
    status = "ACCESS TOKEN INVALID";
  } else if (name === "CUSTOM") {
    statusCode = code ? code : statusCode;
    status = message ? message : status;
  } else if (error === "JsonWebTokenError" || name === "JsonWebTokenError") {
    statusCode = 403;
    status = "ACCESS TOKEN INVALID";
  }

  response(res, statusCode, "ERROR", { errorMessage: status });
};

export default errorHandler;
