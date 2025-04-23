"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usersController_1 = require("../controllers/usersController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var usersRouter = express_1.default.Router();
usersRouter.get("/", verifyJWT_1.verifyJWT, usersController_1.getAllUsers);
usersRouter.put("/:userId", verifyJWT_1.verifyJWT, usersController_1.editUser);
exports.default = usersRouter;
//# sourceMappingURL=users.js.map