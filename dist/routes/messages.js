"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var messagesController_1 = require("../controllers/messagesController");
var verifyJWT_1 = require("../middleware/verifyJWT");
var messagesRouter = express_1.default.Router();
messagesRouter.post("/new", verifyJWT_1.verifyJWT, messagesController_1.newMessage);
messagesRouter.get("/", verifyJWT_1.verifyJWT, messagesController_1.getMessagesInConversation);
messagesRouter.route("/:id")
    .delete(verifyJWT_1.verifyJWT, messagesController_1.deleteMessage)
    .put(verifyJWT_1.verifyJWT, messagesController_1.editMessage);
exports.default = messagesRouter;
//# sourceMappingURL=messages.js.map