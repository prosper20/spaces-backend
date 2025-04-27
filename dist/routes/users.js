"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usersController_1 = require("../controllers/usersController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var usersRouter = (0, express_1.Router)();
usersRouter.get("/users", usersController_1.getAllUsers);
usersRouter.put("/users/:userId", verifyJWT_1.verifyJWT, usersController_1.editUser);
exports.default = usersRouter;
//# sourceMappingURL=users.js.map