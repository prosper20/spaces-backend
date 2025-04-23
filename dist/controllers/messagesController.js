"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.editMessage = exports.getMessagesInConversation = exports.newMessage = void 0;
var db_1 = require("../db");
var newMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, conversationId, authorId, newMessage_1, err_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, message = _a.message, conversationId = _a.conversationId;
                if (!message || message.trim() === "")
                    return [2 /*return*/, res.status(400).json({ message: "Must provide a message" })];
                if (!conversationId)
                    return [2 /*return*/, res.status(400).json({ message: "Must provide a conversationId" })];
                authorId = req.userId;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.message.create({
                        data: {
                            message: message,
                            authorId: authorId,
                            conversationId: conversationId,
                        },
                        include: {
                            conversation: {
                                include: {
                                    participants: true,
                                },
                            },
                        },
                    })];
            case 2:
                newMessage_1 = _d.sent();
                return [4 /*yield*/, db_1.db.conversation.update({
                        where: { id: conversationId },
                        data: { dateLastMessage: new Date() },
                    })];
            case 3:
                _d.sent();
                return [4 /*yield*/, Promise.all((_c = (_b = newMessage_1.conversation) === null || _b === void 0 ? void 0 : _b.participants.map(function (participant) {
                        if (participant.userId !== authorId) {
                            return db_1.db.conversationUser.update({
                                where: {
                                    conversationId_userId: {
                                        conversationId: conversationId,
                                        userId: participant.userId,
                                    },
                                },
                                data: { isRead: false },
                            });
                        }
                    })) !== null && _c !== void 0 ? _c : [])];
            case 4:
                _d.sent();
                res.status(200).json({
                    id: newMessage_1.id,
                    message: newMessage_1.message,
                    authorId: newMessage_1.authorId,
                    created_at: newMessage_1.created_at,
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _d.sent();
                console.error(err_1);
                res.status(500).json({ message: err_1 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.newMessage = newMessage;
// export const newMessage = async (req: Request, res: Response) => {
//   const { message, conversationId } = req.body;
//   if (!message || message.trim() === "")
//     return res.status(400).json({ message: "Must provide a message" });
//   if (!conversationId)
//     return res.status(400).json({ message: "Must provide a conversationId" });
//   const authorId = req.userId;
//   try {
//     const newMessage = await db.message.create({
//       data: {
//         message,
//         authorId,
//         conversationId,
//       },
//       include: {
//         conversation: {
//           include: {
//             participants: true,
//           },
//         },
//       },
//     });
//     await db.conversation.update({
//       where: { id: conversationId },
//       data: { dateLastMessage: new Date() },
//     });
//     await Promise.all(
//       newMessage.conversation?.participants.map((participant) => {
//         if (participant.userId !== authorId) {
//           return db.conversationUser.update({
//             where: {
//               conversationId_userId: {
//                 conversationId,
//                 userId: participant.userId,
//               },
//             },
//             data: { isRead: false },
//           });
//         }
//       }) ?? []
//     );
//     res.status(200).json({
//       id: newMessage.id,
//       message: newMessage.message,
//       authorId: newMessage.authorId,
//       created_at: newMessage.created_at,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err });
//   }
// };
// Get all messages in a conversation
var getMessagesInConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, conversationId, _b, page, _c, limit, currentUserId, parsedPage, parsedLimit, conversation, isParticipant, messages, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, conversationId = _a.conversationId, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                if (!conversationId)
                    return [2 /*return*/, res.status(400).json({ message: "Must provide a conversationId" })];
                currentUserId = req.userId;
                parsedPage = parseInt(page);
                parsedLimit = parseInt(limit);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.conversation.findUnique({
                        where: { id: conversationId },
                        include: { participants: true },
                    })];
            case 2:
                conversation = _d.sent();
                isParticipant = conversation === null || conversation === void 0 ? void 0 : conversation.participants.some(function (p) { return p.userId === currentUserId; });
                if (!isParticipant) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                return [4 /*yield*/, db_1.db.conversationUser.update({
                        where: {
                            conversationId_userId: {
                                conversationId: conversationId,
                                userId: currentUserId,
                            },
                        },
                        data: { isRead: true },
                    })];
            case 3:
                _d.sent();
                return [4 /*yield*/, db_1.db.message.findMany({
                        where: {
                            conversationId: conversationId,
                        },
                        orderBy: { created_at: "desc" },
                        skip: (parsedPage - 1) * parsedLimit,
                        take: parsedLimit,
                    })];
            case 4:
                messages = _d.sent();
                res.status(200).json(messages);
                return [3 /*break*/, 6];
            case 5:
                err_2 = _d.sent();
                console.error(err_2);
                res.status(500).json({ message: err_2 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getMessagesInConversation = getMessagesInConversation;
// Edit a message
var editMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newMessageBody, messageId, message, updatedMessage, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newMessageBody = req.body.message;
                messageId = req.params.id;
                if (!newMessageBody || newMessageBody.trim() === "")
                    return [2 /*return*/, res.status(400).json({ message: "Message cannot be empty" })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db.message.findUnique({ where: { id: messageId } })];
            case 2:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res.status(404).json({ message: "Message not found" })];
                }
                if (message.authorId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ message: "You can only edit your own messages" })];
                }
                return [4 /*yield*/, db_1.db.message.update({
                        where: { id: messageId },
                        data: {
                            message: newMessageBody,
                            isEdited: true,
                        },
                    })];
            case 3:
                updatedMessage = _a.sent();
                res.status(200).json({ updatedMessage: updatedMessage });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).json({ message: err_3 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.editMessage = editMessage;
// Delete a message
var deleteMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, message, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messageId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db.message.findUnique({ where: { id: messageId } })];
            case 2:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res.status(404).json({ message: "Message not found" })];
                }
                if (message.authorId !== req.userId) {
                    return [2 /*return*/, res.status(403).json({ message: "You can only delete your own messages" })];
                }
                return [4 /*yield*/, db_1.db.message.delete({ where: { id: messageId } })];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Message deleted successfully", messageId: messageId });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).json({ message: err_4 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messagesController.js.map