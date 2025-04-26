"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tasksController_1 = require("../controllers/tasksController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var taskRouter = (0, express_1.Router)();
taskRouter.post("/tasks", verifyJWT_1.verifyJWT, tasksController_1.createTask);
taskRouter.get("/tasks", tasksController_1.getTasksByUser);
exports.default = taskRouter;
//# sourceMappingURL=taskRouter.js.map