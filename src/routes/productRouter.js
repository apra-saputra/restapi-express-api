const ProductControl = require("../controller/productControl");

const route = require("express").Router();

route.get("/", ProductControl.getProducts);
route.get("/:id", ProductControl.getProductById);

module.exports = route;
