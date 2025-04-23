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
exports.handleLogout = exports.handlePersistentLogin = exports.handleRefreshToken = exports.loginUser = exports.verifyOtpAndCreateUser = exports.registerNewUser = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = require("../db");
var otp_1 = require("../lib/otp");
var redis_1 = require("../lib/redis");
var registerNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, passwordConfirm, role, existingUser, hashedPassword, otp, expiresInSec, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password, passwordConfirm = _a.passwordConfirm;
                if (!fullName)
                    return [2 /*return*/, res.status(400).json({ message: "Full name is required" })];
                if (!email)
                    return [2 /*return*/, res.status(400).json({ message: "Email is required" })];
                if (!password)
                    return [2 /*return*/, res.status(400).json({ message: "Password is required" })];
                role = req.body.role || 'STUDENT';
                if (password != passwordConfirm)
                    return [2 /*return*/, res.status(401).json({ message: "Passwords do not match" })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, db_1.db.user.findFirst({ where: { email: email } })];
            case 2:
                existingUser = _b.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(403).json({ message: "Email already in use" })];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                otp = (0, otp_1.generateOTP)();
                expiresInSec = 5 * 60;
                return [4 /*yield*/, (0, otp_1.setOtp)(redis_1.redisClient, email, otp, "verify", expiresInSec, {
                        fullName: fullName,
                        email: email,
                        role: role,
                        hashedPassword: hashedPassword,
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, otp_1.transporter.sendMail({
                        from: process.env.SMTP_USER,
                        to: email,
                        subject: "Verify your email",
                        html: "<p>Your OTP is: <strong>".concat(otp, "</strong>. It expires in 5 minutes.</p>"),
                    })];
            case 5:
                _b.sent();
                res.status(200).json({ message: "OTP sent to email" });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500).json({ message: "Failed to register user" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.registerNewUser = registerNewUser;
var verifyOtpAndCreateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, stored, user, accessToken, refreshToken, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, otp = _a.otp;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, otp_1.getOtp)(redis_1.redisClient, email)];
            case 2:
                stored = _b.sent();
                if (!stored || stored.otp !== otp)
                    return [2 /*return*/, res.status(400).json({ message: "Invalid OTP" })];
                if (stored.action !== "verify" || !(stored === null || stored === void 0 ? void 0 : stored.userData))
                    return [2 /*return*/, res.status(400).json({ message: "OTP not valid for registration" })];
                return [4 /*yield*/, db_1.db.user.create({
                        data: {
                            fullName: stored.userData.fullName,
                            email: stored.userData.email,
                            password: stored.userData.hashedPassword,
                            role: stored.userData.role,
                        },
                    })];
            case 3:
                user = _b.sent();
                return [4 /*yield*/, (0, otp_1.deleteOtp)(redis_1.redisClient, email)];
            case 4:
                _b.sent();
                accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
                return [4 /*yield*/, db_1.db.user.update({
                        where: { id: user.id },
                        data: { refresh_token: refreshToken },
                    })];
            case 5:
                _b.sent();
                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(201).json({
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    accessToken: accessToken,
                });
                return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                console.error(err_2);
                res.status(500).json({ message: "OTP verification failed" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtpAndCreateUser = verifyOtpAndCreateUser;
var loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, accessToken, refreshToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    return [2 /*return*/, res.status(400).json({ message: "Email and password are required" })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.user.findFirst({ where: { email: email } })];
            case 2:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(400).json({ message: "Incorrect password" })];
                accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
                return [4 /*yield*/, db_1.db.user.update({
                        where: { id: user.id },
                        data: { refresh_token: refreshToken },
                    })];
            case 4:
                _b.sent();
                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    profile_picture: user.profile_picture,
                    accessToken: accessToken,
                });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                console.error(err_3);
                res.status(500).json({ message: "Login failed" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
var handleRefreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, user_1, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                refreshToken = cookies.jwt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.user.findFirst({ where: { refresh_token: refreshToken } })];
            case 2:
                user_1 = _a.sent();
                if (!user_1)
                    return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
                    if (err || decoded.userId !== user_1.id)
                        return res.status(403).json({ message: "Invalid token" });
                    var accessToken = jsonwebtoken_1.default.sign({ userId: user_1.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                    res.status(200).json({ accessToken: accessToken });
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).json({ message: "Token refresh failed" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handleRefreshToken = handleRefreshToken;
var handlePersistentLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, user_2, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                refreshToken = cookies.jwt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.user.findFirst({ where: { refresh_token: refreshToken } })];
            case 2:
                user_2 = _a.sent();
                if (!user_2)
                    return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
                    if (err || decoded.userId !== user_2.id)
                        return res.status(403).json({ message: "Invalid token" });
                    var accessToken = jsonwebtoken_1.default.sign({ userId: user_2.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                    res.status(200).json({
                        id: user_2.id,
                        fullName: user_2.fullName,
                        email: user_2.email,
                        profile_picture: user_2.profile_picture,
                        role: user_2.role,
                        accessToken: accessToken,
                    });
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error(err_5);
                res.status(500).json({ message: "Persistent login failed" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handlePersistentLogin = handlePersistentLogin;
var handleLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, user, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.sendStatus(204)]; // No content
                refreshToken = cookies.jwt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.user.findFirst({ where: { refresh_token: refreshToken } })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.db.user.update({
                        where: { id: user.id },
                        data: { refresh_token: "" },
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.clearCookie("jwt", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.sendStatus(204);
                return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                console.error(err_6);
                res.status(500).json({ message: "Logout failed" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.handleLogout = handleLogout;
//# sourceMappingURL=authController.js.map