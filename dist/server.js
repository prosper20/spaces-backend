"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var auth_1 = __importDefault(require("./routes/auth"));
var users_1 = __importDefault(require("./routes/users"));
var corsOptions_1 = require("./config/corsOptions");
var messages_1 = __importDefault(require("./routes/messages"));
var conversations_1 = __importDefault(require("./routes/conversations"));
var credentials_1 = require("./middleware/credentials");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var PORT = 3000;
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://127.0.0.1:3000",
            "https://spaces-frontend-lovat.vercel.app",
            "http://localhost:3000",
        ],
    },
});
app.use(credentials_1.credentials);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/messages", messages_1.default);
app.use("/api/conversations", conversations_1.default);
// server.listen(3000, () => {
//   console.log(`Server running on port ${PORT}`);
// });
var startServer = function () {
    try {
        server.listen(PORT, function () {
            console.log("Server running on port ".concat(PORT));
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
};
startServer();
// if (redisClient.connected) {
//   startServer();
// } else {
//   console.error("Failed to start server; redis connection failed");
// }
var activeUsers = new Set();
io.on("connection", function (socket) {
    var userId = socket.handshake.query.id;
    socket.join(userId);
    activeUsers.add(userId);
    io.to(socket.id).emit("online-users", Array.from(activeUsers));
    socket.broadcast.emit("user-connected", userId);
    socket.on("send-message", function (_a) {
        var id = _a.id, authorId = _a.authorId, groupId = _a.groupId, conversationId = _a.conversationId, message = _a.message, timeSent = _a.timeSent;
        io.to(groupId).emit("receive-message", {
            id: id,
            authorId: authorId,
            conversationId: conversationId,
            message: message,
            timeSent: timeSent,
        });
    });
    socket.on("disconnect", function () {
        activeUsers.delete(userId);
        socket.broadcast.emit("user-disconnected", userId);
    });
});
//# sourceMappingURL=server.js.map