"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var messagesController_1 = require("../controllers/messagesController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var messagesRouter = (0, express_1.Router)();
messagesRouter.post("/messages/new", verifyJWT_1.verifyJWT, messagesController_1.newMessage);
messagesRouter.get("/messages", verifyJWT_1.verifyJWT, messagesController_1.getMessagesInConversation);
messagesRouter.route("/messages/:id")
    .delete(verifyJWT_1.verifyJWT, messagesController_1.deleteMessage)
    .put(verifyJWT_1.verifyJWT, messagesController_1.editMessage);
exports.default = messagesRouter;
//# sourceMappingURL=messages.js.map