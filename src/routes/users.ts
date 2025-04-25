import { Router } from "express";
import { editUser, getAllUsers } from "../controllers/usersController";
import { verifyJWT } from "../middleware/verifyJWT";

const usersRouter: Router = Router();

usersRouter.get("/users", verifyJWT, getAllUsers);

usersRouter.put("/users/:userId", verifyJWT, editUser)

export default usersRouter;
