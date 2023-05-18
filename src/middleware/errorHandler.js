const response = require("../helpers/response");

const errorHandler = (error, req, res, next) => {
  console.log(error);
  const statusCode = 500;
  const status = "Internal Server Error";

  response(res, statusCode, status);
};

module.exports = errorHandler;
