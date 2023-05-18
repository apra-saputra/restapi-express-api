const response = require("../helpers/response");

const errorHandler = (error, req, res, next) => {
  console.log(error);
  let statusCode = 500;
  let status = "INTERNAL SERVER ERROR";

  const { name } = error;

  if (name === "NOT_FOUND") {
    statusCode = 404;
    status = "DATA NOT FOUND";
  }

  response(res, statusCode, status);
};

module.exports = errorHandler;
