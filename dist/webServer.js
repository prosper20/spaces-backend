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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var socket_1 = require("./socket");
var processService_1 = require("./lib/processService");
var WebServer = /** @class */ (function () {
    function WebServer(config, routers) {
        this.config = config;
        this.routers = routers;
        this.started = false;
        this.express = this.createExpress();
        this.server = http_1.default.createServer(this.express);
        this.initializeSocketIo(config);
        this.configureExpress(config);
        this.setupRoutes();
    }
    WebServer.prototype.createExpress = function () {
        return (0, express_1.default)();
    };
    WebServer.prototype.configureExpress = function (config) {
        // Handle preflight requests first
        this.express.options('*', (0, cors_1.default)({
            origin: config.allowedOrigins,
            credentials: true,
            optionsSuccessStatus: 200
        }));
        // Then apply CORS middleware for all other requests
        this.express.use((0, cors_1.default)({
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin)
                    return callback(null, true);
                if (config.allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    console.log('CORS blocked for origin:', origin);
                    callback(new Error('Not allowed by CORS'), false);
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            optionsSuccessStatus: 200,
        }));
        this.express.use(function (req, res, next) {
            // Always set these headers for allowed origins
            var origin = req.headers.origin;
            if (origin && config.allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Origin', origin);
            }
            next();
        });
        this.express.use(express_1.default.json());
        this.express.use((0, cookie_parser_1.default)());
    };
    // private configureExpress(config: WebServerConfig) {
    //   this.express.use((req: Request, res: Response, next: NextFunction) => {
    //     const origin = req.headers.origin as string;
    //     if (config.allowedOrigins.includes(origin)) {
    //       res.header("Access-Control-Allow-Credentials", "true");
    //     }
    //     next();
    //   });
    //   this.express.use(
    //     cors<Request>({
    //       origin: (origin: string | undefined, callback) => {
    //         if (config.allowedOrigins.indexOf(origin!) !== -1 || !origin) {
    //           callback(null, origin);
    //         } else {
    //           console.log(origin);
    //           callback(new Error("Not allowed by CORS"), false);
    //         }
    //       },
    //       optionsSuccessStatus: 200,
    //     }),
    //   );
    //   this.express.use(express.json());
    //   this.express.use(cookieParser());
    // }
    WebServer.prototype.setupRoutes = function () {
        var _this = this;
        this.routers.forEach(function (router) {
            _this.express.use(router);
        });
    };
    WebServer.prototype.initializeSocketIo = function (config) {
        this.io = new socket_io_1.default.Server(this.server, {
            cors: {
                origin: config.allowedOrigins,
                credentials: true,
            },
        });
    };
    WebServer.prototype.getHttp = function () {
        if (!this.server)
            throw new Error("Server not yet started");
        return this.server;
    };
    WebServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _reject) {
                        processService_1.ProcessService.killProcessOnPort(_this.config.port, function () {
                            (0, socket_1.socketRouter)(_this.io);
                            _this.server.listen(_this.config.port, function () {
                                console.log("Server is running on port ".concat(_this.config.port));
                                _this.started = true;
                                resolve();
                            });
                        });
                    })];
            });
        });
    };
    WebServer.prototype.isStarted = function () {
        return this.started;
    };
    WebServer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, _reject) {
                        if (_this.server) {
                            _this.server.close(function () {
                                _this.started = false;
                                resolve();
                            });
                        }
                    })];
            });
        });
    };
    return WebServer;
}());
exports.WebServer = WebServer;
//# sourceMappingURL=webServer.js.map