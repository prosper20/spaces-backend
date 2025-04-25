import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, Router } from "express";
import http, { Server } from "http";
import socketIo from "socket.io";

import { socketRouter } from "./socket";
import { ProcessService } from "./lib/processService";

type WebServerConfig = {
  port: number;
  allowedOrigins: string[];
};

export class WebServer {
  private express: express.Express;
  private server: Server | undefined;
  private started = false;
  private io: socketIo.Server;

  constructor(private config: WebServerConfig, private routers: Router[]) {
    this.express = this.createExpress();
    this.server = http.createServer(this.express);
    this.initializeSocketIo(config);
    this.configureExpress(config);
    this.setupRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress(config: WebServerConfig) {
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      const origin = req.headers.origin as string;
      if (config.allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
      }
      next();
    });

    this.express.use(
      cors<Request>({
        origin: (origin: string | undefined, callback) => {
          if (config.allowedOrigins.indexOf(origin!) !== -1 || !origin) {
            callback(null, origin);
          } else {
            console.log(origin);
            callback(new Error("Not allowed by CORS"), false);
          }
        },
        optionsSuccessStatus: 200,
      }),
    );
    this.express.use(express.json());
    this.express.use(cookieParser());
  }

  private setupRoutes() {
    this.routers.forEach((router) => {
      this.express.use(router);
    });
  }

  private initializeSocketIo(config: WebServerConfig) {
    this.io = new socketIo.Server(this.server, {
      cors: {
        origin: config.allowedOrigins,
      },
    });
  }

  getHttp() {
    if (!this.server) throw new Error("Server not yet started");
    return this.server;
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        socketRouter(this.io);

        this.server.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.started = true;
          resolve();
        });
      });
    });
  }

  isStarted() {
    return this.started;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false;
          resolve();
        });
      }
    });
  }
}