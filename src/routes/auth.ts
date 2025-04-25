import { Router } from 'express';
import { handleLogout, handlePersistentLogin, handleRefreshToken, loginUser, registerNewUser, verifyOtpAndCreateUser } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/auth/signup", registerNewUser);

authRouter.post("/auth/signup/verify", verifyOtpAndCreateUser);

authRouter.post("/auth/login", loginUser);

authRouter.get("/auth/refresh", handleRefreshToken);

authRouter.get("/auth/login/persist", handlePersistentLogin);

authRouter.post("/auth/logout", handleLogout);

export default authRouter;
