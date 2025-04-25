"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var conversationsController_1 = require("../controllers/conversationsController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var conversationsRouter = (0, express_1.Router)();
conversationsRouter.post("/conversations/new", verifyJWT_1.verifyJWT, conversationsController_1.newConversation);
conversationsRouter.get("/conversations/:userId", verifyJWT_1.verifyJWT, conversationsController_1.getAllConversations);
conversationsRouter.put("/conversations/:conversationId/read", verifyJWT_1.verifyJWT, conversationsController_1.readConversation);
exports.default = conversationsRouter;
//# sourceMappingURL=conversations.js.map