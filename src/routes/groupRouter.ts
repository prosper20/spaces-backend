import { Router } from "express";
import { createGroup, getGroupById, getGroupDashboardData, getGroupsByUser, joinGroup, searchAllGroups } from "../controllers/groupsController";
import { verifyJWT } from "../middleware/verifyJWT";

const groupRouter = Router();


groupRouter.post("/groups", verifyJWT, createGroup);
groupRouter.get("/groups", verifyJWT, getGroupsByUser);
groupRouter.post("/groups/join", verifyJWT, joinGroup);
groupRouter.get("/groups/search", searchAllGroups);
groupRouter.get("/groups/:groupId", getGroupById);
groupRouter.get("/groups/:groupId/dashboard", getGroupDashboardData);


export default groupRouter;
