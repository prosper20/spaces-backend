"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var authRouter = (0, express_1.Router)();
authRouter.post("/auth/signup", authController_1.registerNewUser);
authRouter.post("/auth/signup/verify", authController_1.verifyOtpAndCreateUser);
authRouter.post("/auth/login", authController_1.loginUser);
authRouter.get("/auth/refresh", authController_1.handleRefreshToken);
authRouter.get("/auth/login/persist", authController_1.handlePersistentLogin);
authRouter.post("/auth/logout", authController_1.handleLogout);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map