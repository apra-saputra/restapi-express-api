const response = (res, statusCode = 200, status = "OK", data = []) => {
  res.status(statusCode).json({ statusCode, status, payload: data });
};

export default response;
