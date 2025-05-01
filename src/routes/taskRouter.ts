import { Router } from "express";
import {
  createTask,
  getTasksByUser,
  getWeeklyContributions,
  getAgendaForToday,
  getTaskStatusGraphData,
  updateTaskStatus,
} from "../controllers/tasksController";
import { verifyJWT } from "../middleware/verifyJWT";

const taskRouter = Router();

taskRouter.post("/tasks", verifyJWT, createTask);
taskRouter.get("/tasks", verifyJWT, getTasksByUser);

taskRouter.get("/tasks/contributions-week", verifyJWT, getWeeklyContributions);
taskRouter.get("/tasks/agenda-today", verifyJWT, getAgendaForToday);
taskRouter.get("/tasks/status-graph", verifyJWT, getTaskStatusGraphData);

taskRouter.patch("/tasks/:taskId", verifyJWT, updateTaskStatus);

export default taskRouter;
