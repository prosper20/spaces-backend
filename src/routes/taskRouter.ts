import { Router } from "express";
import { createTask, getTasksByUser } from "../controllers/tasksController";
import { verifyJWT } from "../middleware/verifyJWT";

const taskRouter = Router();


taskRouter.post("/tasks", verifyJWT, createTask);
taskRouter.get("/tasks", getTasksByUser);

export default taskRouter;
