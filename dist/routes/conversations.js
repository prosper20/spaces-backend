"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var conversationsController_1 = require("../controllers/conversationsController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var conversationsRouter = express_1.default.Router();
conversationsRouter.post("/new", verifyJWT_1.verifyJWT, conversationsController_1.newConversation);
conversationsRouter.get("/:userId", verifyJWT_1.verifyJWT, conversationsController_1.getAllConversations);
conversationsRouter.put("/:conversationId/read", verifyJWT_1.verifyJWT, conversationsController_1.readConversation);
exports.default = conversationsRouter;
//# sourceMappingURL=conversations.js.map