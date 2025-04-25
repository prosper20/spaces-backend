import { Router } from "express";
import {
  getAllConversations,
  newConversation,
  readConversation,
} from "../controllers/conversationsController";
import { verifyJWT } from "../middleware/verifyJWT";

const conversationsRouter: Router = Router();

conversationsRouter.post("/conversations/new", verifyJWT, newConversation);

conversationsRouter.get("/conversations/:userId", verifyJWT, getAllConversations);

conversationsRouter.put("/conversations/:conversationId/read", verifyJWT, readConversation);

export default conversationsRouter;
