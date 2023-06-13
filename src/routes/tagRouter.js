import { Router } from "express";
import TagControl from "../controller/tagsControl.js";

const route = Router();

route.get("/", TagControl.getTags);
route.get("/:id", TagControl.getTagById);
route.put("/:id", TagControl.updateTag);

export default route;
