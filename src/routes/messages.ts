import { Router } from "express";
import { deleteMessage, editMessage, getMessagesInConversation, newMessage } from "../controllers/messagesController";
import { verifyJWT } from "../middleware/verifyJWT";

const messagesRouter: Router = Router();

messagesRouter.post("/messages/new", verifyJWT, newMessage);
messagesRouter.get("/messages", verifyJWT, getMessagesInConversation)
messagesRouter.route("/messages/:id")
  .delete(verifyJWT, deleteMessage)
  .put(verifyJWT, editMessage)

export default messagesRouter;