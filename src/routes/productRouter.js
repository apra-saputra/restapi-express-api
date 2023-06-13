import { Router } from "express";

import ProductControl from "../controller/productControl.js";

const route = Router();

route.get("/", ProductControl.getProducts);
route.get("/download-template", ProductControl.downloadTemplateProduct);
route.get("/:id", ProductControl.getProductById);
route.patch("/:id", ProductControl.updateImageProduct);
route.delete("/:id", ProductControl.hardDeleteProduct);

export default route;
