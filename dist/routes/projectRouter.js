"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var verifyJWT_1 = require("../middleware/verifyJWT");
var projectsController_1 = require("../controllers/projectsController");
var projectRouter = (0, express_1.Router)();
projectRouter.post("/projects", verifyJWT_1.verifyJWT, projectsController_1.createProject);
projectRouter.get("/projects", projectsController_1.getProjectsByUser);
exports.default = projectRouter;
//# sourceMappingURL=projectRouter.js.map