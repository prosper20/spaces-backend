import "./lib/redis";

import authRouter from "./routes/auth";
import conversationsRouter from "./routes/conversations";
import messagesRouter from "./routes/messages";
import usersRouter from "./routes/users";
import { WebServer } from "./webServer";


const port = parseInt(process.env.PORT || '3000', 10)
const allowedOrigins = [
      "http://127.0.0.1:3000",
      "https://spaces-frontend-lovat.vercel.app",
      "http://localhost:3000",
    ]

process.on("uncaughtException", (err) => {
  process.exit(1);
});

const server = new WebServer({
  port,
  allowedOrigins,
}, [
  authRouter,
  usersRouter,
  conversationsRouter,
  messagesRouter,
]);
server.start();

process.on("unhandledRejection", async (err) => {
  await server.stop();
  process.exit(1);
});

process.on("SIGTERM", () => {
  server.stop();
});