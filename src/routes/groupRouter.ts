import { Router } from "express";
import { createGroup, getGroupById, getGroupDashboardData, getGroupsByUser } from "../controllers/groupsController";
import { verifyJWT } from "../middleware/verifyJWT";

const groupRouter = Router();


groupRouter.post("/groups", verifyJWT, createGroup);
groupRouter.get("/groups", getGroupsByUser);
groupRouter.get("/groups/:groupId", getGroupById);
groupRouter.get("/groups/:groupId/dashboard", getGroupDashboardData);


export default groupRouter;
