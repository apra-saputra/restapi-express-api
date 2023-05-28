import { Router } from "express";
import WorkflowControl from "../controller/workflowControl.js";

const route = Router();

/**
 * @swagger
 * /workflows:
 *   get:
 *     summary: Mendapatkan semua tags
 *     tags: [Tags]
 */
route.get("/", WorkflowControl.getWorkflows);

export default route;
