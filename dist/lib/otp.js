"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOtp = exports.getOtp = exports.setOtp = exports.transporter = exports.generateOTP = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var generateOTP = function () {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.generateOTP = generateOTP;
// Setup nodemailer transporter
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
exports.transporter.verify(function (error, success) {
    if (error) {
        console.error("Failed to connect to mail server:", error);
    }
    else {
        console.log("SMTP transporter is ready:", success);
    }
});
var setOtp = function (client, email, otp, action, expiresInSec, userData) {
    return new Promise(function (resolve, reject) {
        var payload = JSON.stringify({ otp: otp, action: action, userData: userData });
        client.setex("otp:".concat(email), expiresInSec, payload, function (err, reply) {
            if (err)
                return reject(err);
            resolve(reply);
        });
    });
};
exports.setOtp = setOtp;
var getOtp = function (client, email) {
    return new Promise(function (resolve, reject) {
        client.get("otp:".concat(email), function (err, reply) {
            if (err)
                return reject(err);
            if (!reply)
                return resolve(null);
            try {
                resolve(JSON.parse(reply));
            }
            catch (parseError) {
                reject(parseError);
            }
        });
    });
};
exports.getOtp = getOtp;
var deleteOtp = function (client, email) {
    return new Promise(function (resolve, reject) {
        client.del("otp:".concat(email), function (err, reply) {
            if (err)
                return reject(err);
            resolve(reply);
        });
    });
};
exports.deleteOtp = deleteOtp;
//# sourceMappingURL=otp.js.map