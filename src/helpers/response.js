const response = (res, statusCode = 200, status = "OK", payload = []) => {
  res.status(statusCode).json({ statusCode, payload });
};

export default response;
