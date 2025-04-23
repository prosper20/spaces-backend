"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
var redis_1 = __importDefault(require("redis"));
var redisClient = redis_1.default.createClient(process.env.REDIS_URL || '');
exports.redisClient = redisClient;
redisClient.on("connect", function () {
    console.log("[Redis]: Connected to redis server \uD83D\uDE80");
});
redisClient.on("error", function (err) {
    console.error("[Redis]: Error connecting to Redis at: ".concat(process.env.REDIS_URL || '', "\nError message: ").concat(err.message));
});
//# sourceMappingURL=redis.js.map