import { Router } from "express";
import TagControl from "../controller/tagsControl.js";

const route = Router();

/**
 * @swagger
 * /tags:
 *  get:
 *    summary: Mendapatkan semua tags
 *    tags: [Tags]
 *
 */
route.get("/", TagControl.getTags);

/**
 * @swagger
 * /tags/{id}:
 *  get:
 *    summary: Mendapatkan semua tags detail
 *    tags: [Tags]
 *
 */
route.get("/:id", TagControl.getTagById);

/**
 * @swagger
 * /tags:
 *  put:
 *    summary: Mengupdate Tag
 *    tags: [Tags]
 *
 */
route.put("/:id", TagControl.updateTag);

export default route;
