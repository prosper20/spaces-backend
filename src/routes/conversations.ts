import { Router } from "express";
import {
  getAllConversations,
  getConversationById,
} from "../controllers/conversationsController";
import { verifyJWT } from "../middleware/verifyJWT";
import { getMessagesInConversation, newMessage } from "../controllers/messagesController";

const conversationsRouter: Router = Router();

conversationsRouter.get("/conversations", verifyJWT, getAllConversations);
conversationsRouter.get("/conversations/:conversationId", verifyJWT, getConversationById);

conversationsRouter.get(
  "/conversations/:conversationId/messages",
  verifyJWT,
  getMessagesInConversation
);
conversationsRouter.post(
  "/conversations/:conversationId/messages",
  verifyJWT,
  newMessage
);


export default conversationsRouter;


// GET /conversations/:id/messages?limit=50&cursor=2025-04-30T06:35:55.972Z

// {
//   "messages": [
//     {
//       "id": "cma3kbe870001um9g2gtn1okk",
//       "createdAt": "2025-04-30T06:35:55.972Z",
//       "text": "Hey team, don't forget to check the dataset.",
//       "author": {
//         "id": "cm9zn780i0000um6mxjqx5v5u",
//         "firstName": "Courtney",
//         "lastName": "Henry",
//         "avatar": "https://randomuser.me/api/portraits/women/1.jpg",
//         "role": "student"          // ← use to derive the tag if you like
//       },
//       "files": [],
//       "type": null,
//       "isEdited": false
//     },
//     …
//   ],
//   "nextCursor": "2025-04-29T20:14:02.113Z"   // null when no older messages
// }


// System info messages
// Return them in the same list but set:

// js
// Copy
// Edit
// {
//   "type": "info",
//   "text": "Dr Miles pinned the dataset link.",
//   "author": null         // optional
// }