const response = (
  res,
  statusCode = 200,
  status = "OK",
  payload = { data: [] }
) => {
  res.status(statusCode).json({ statusCode, status, payload });
};

export default response;
