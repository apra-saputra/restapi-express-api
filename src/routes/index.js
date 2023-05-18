const route = require("express").Router();
const productRoute = require("./productRouter");

route.get("", (req, res) => {
  res.send("service ready...🚀");
});

route.use("/products", productRoute);

module.exports = route;
