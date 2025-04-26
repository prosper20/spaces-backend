import { Router } from "express";
import { createGroup, getGroupsByUser } from "../controllers/groupsController";
import { verifyJWT } from "../middleware/verifyJWT";

const groupRouter = Router();


groupRouter.post("/groups", verifyJWT, createGroup);
groupRouter.get("/groups", getGroupsByUser);

export default groupRouter;
