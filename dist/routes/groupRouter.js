"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var groupsController_1 = require("../controllers/groupsController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var groupRouter = (0, express_1.Router)();
groupRouter.post("/groups", verifyJWT_1.verifyJWT, groupsController_1.createGroup);
groupRouter.get("/groups", groupsController_1.getGroupsByUser);
groupRouter.get("/groups/:groupId", groupsController_1.getGroupById);
groupRouter.get("/groups/:groupId/dashboard", groupsController_1.getGroupDashboardData);
exports.default = groupRouter;
//# sourceMappingURL=groupRouter.js.map