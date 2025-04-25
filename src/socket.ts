import socketIo from "socket.io";

const activeUsers = new Set<string>();

const newConnection = (socket: socketIo.Socket, io: socketIo.Server) => {
  try {
    const userId = socket.handshake.query.id as string;
    socket.join(userId);

    activeUsers.add(userId);
    io.to(socket.id).emit("online-users", Array.from(activeUsers));
    socket.broadcast.emit("user-connected", userId);
  } catch (error) {
    console.log("Socket connection error:", error);
  }
};

const handleDisconnect = (socket: socketIo.Socket, io: socketIo.Server) => {
  const userId = socket.handshake.query.id as string;

  activeUsers.delete(userId);
  socket.broadcast.emit("user-disconnected", userId);
};


type SendMessagePayload = {
  id: string;
  authorId: string;
  groupId: string;
  conversationId: string;
  message: string;
  timeSent: Date;
};

export const socketRouter = (io: socketIo.Server) => {
  io.on("connection", (socket) => {
    newConnection(socket, io);

    socket.on("send-message", (msg: SendMessagePayload) => {
      io.to(msg.groupId).emit("receive-message", {
        id: msg.id,
        authorId: msg.authorId,
        conversationId: msg.conversationId,
        message: msg.message,
        timeSent: msg.timeSent,
      });
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket, io);
      socket.removeAllListeners("disconnect");
    });

    socket.on("error", (err) => {
      console.log("Socket error:", err.stack);
    });
  });
};
