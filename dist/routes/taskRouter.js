"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tasksController_1 = require("../controllers/tasksController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var taskRouter = (0, express_1.Router)();
taskRouter.post("/tasks", verifyJWT_1.verifyJWT, tasksController_1.createTask);
taskRouter.get("/tasks", verifyJWT_1.verifyJWT, tasksController_1.getTasksByUser);
taskRouter.get("/tasks/contributions-week", verifyJWT_1.verifyJWT, tasksController_1.getWeeklyContributions);
taskRouter.get("/tasks/agenda-today", verifyJWT_1.verifyJWT, tasksController_1.getAgendaForToday);
taskRouter.get("/tasks/status-graph", verifyJWT_1.verifyJWT, tasksController_1.getTaskStatusGraphData);
exports.default = taskRouter;
//# sourceMappingURL=taskRouter.js.map