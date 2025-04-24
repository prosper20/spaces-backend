import express, { Request } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import { corsOptions } from "./config/corsOptions";
import messagesRouter from "./routes/messages";
import conversationsRouter from "./routes/conversations";
import { credentials } from "./middleware/credentials";
import cookieParser from "cookie-parser";
import { redisClient } from "./lib/redis";

const PORT = 3000;
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(cors(corsOptions));
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:3000",
      "https://spaces-frontend-lovat.vercel.app",
      "http://localhost:3000",
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
    credentials: true
  },
});

// app.use(cors({
//   origin: "http://localhost:3002", // your frontend origin
//   credentials: true, // allow cookies/auth headers
// }));

app.use(credentials);
app.use(cors<Request>(corsOptions));
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/conversations", conversationsRouter);

// server.listen(3000, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const startServer = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

// if (redisClient.connected) {
//   startServer();
// } else {
//   console.error("Failed to start server; redis connection failed");
// }


const activeUsers = new Set<string>();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.id as string;
  socket.join(userId);

  activeUsers.add(userId);
  io.to(socket.id).emit("online-users", Array.from(activeUsers));
  socket.broadcast.emit("user-connected", userId);

  socket.on(
    "send-message",
    ({
      id,
      authorId,
      groupId,
      conversationId,
      message,
      timeSent,
    }: {
      id: string;
      authorId: string;
      groupId: string;
      conversationId: string;
      message: string;
      timeSent: Date;
    }) => {
      io.to(groupId).emit("receive-message", {
        id,
        authorId,
        conversationId,
        message,
        timeSent,
      });
    }
  );

  socket.on("disconnect", () => {
    activeUsers.delete(userId);
    socket.broadcast.emit("user-disconnected", userId);
  });
});
