import { Router } from "express";
import WorkflowControl from "../controller/workflowControl.js";

const route = Router();

route.get("/:userId", WorkflowControl.getWorkflows);

export default route;
