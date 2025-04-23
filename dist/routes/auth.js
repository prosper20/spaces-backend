"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../controllers/authController");
var authRouter = express_1.default.Router();
authRouter.post("/signup", authController_1.registerNewUser);
authRouter.post("/signup/verify", authController_1.verifyOtpAndCreateUser);
authRouter.post("/login", authController_1.loginUser);
authRouter.get("/refresh", authController_1.handleRefreshToken);
authRouter.get("/login/persist", authController_1.handlePersistentLogin);
authRouter.post("/logout", authController_1.handleLogout);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map