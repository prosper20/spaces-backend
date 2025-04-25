"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketRouter = void 0;
var activeUsers = new Set();
var newConnection = function (socket, io) {
    try {
        var userId = socket.handshake.query.id;
        socket.join(userId);
        activeUsers.add(userId);
        io.to(socket.id).emit("online-users", Array.from(activeUsers));
        socket.broadcast.emit("user-connected", userId);
    }
    catch (error) {
        console.log("Socket connection error:", error);
    }
};
var handleDisconnect = function (socket, io) {
    var userId = socket.handshake.query.id;
    activeUsers.delete(userId);
    socket.broadcast.emit("user-disconnected", userId);
};
var socketRouter = function (io) {
    io.on("connection", function (socket) {
        newConnection(socket, io);
        socket.on("send-message", function (msg) {
            io.to(msg.groupId).emit("receive-message", {
                id: msg.id,
                authorId: msg.authorId,
                conversationId: msg.conversationId,
                message: msg.message,
                timeSent: msg.timeSent,
            });
        });
        socket.on("disconnect", function () {
            handleDisconnect(socket, io);
            socket.removeAllListeners("disconnect");
        });
        socket.on("error", function (err) {
            console.log("Socket error:", err.stack);
        });
    });
};
exports.socketRouter = socketRouter;
//# sourceMappingURL=socket.js.map