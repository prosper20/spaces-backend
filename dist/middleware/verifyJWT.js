"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var verifyJWT = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ message: "Unauthorized" });
    var token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err)
            return res.status(403).json({ message: "Invalid token" });
        var userId = decoded.userId;
        req.userId = userId;
        next();
    });
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map