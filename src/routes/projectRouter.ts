import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { createProject, getProjectsByUser } from "../controllers/projectsController";

const projectRouter = Router();

projectRouter.post("/projects", verifyJWT, createProject);
projectRouter.get("/projects", getProjectsByUser);

export default projectRouter;
