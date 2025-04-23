import nodemailer from "nodemailer";
import { RedisClient } from "redis";

export type Role = "STUDENT" | "SUPERVISOR";

export const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

// Setup nodemailer transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Failed to connect to mail server:", error);
  } else {
    console.log("SMTP transporter is ready:", success);
  }
});

export const setOtp = (
  client: RedisClient,
  email: string,
  otp: string,
  action: "verify" | "reset",
  expiresInSec: number,
  userData?: { fullName: string; email: string; role: Role; hashedPassword: string }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ otp, action, userData });
    client.setex(`otp:${email}`, expiresInSec, payload, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  });
};


export const getOtp = (
  client: RedisClient,
  email: string
): Promise<{
  otp: string;
  action: "verify" | "reset";
  userData?: { fullName: string; email: string; role: Role; hashedPassword: string };
} | null> => {
  return new Promise((resolve, reject) => {
    client.get(`otp:${email}`, (err, reply) => {
      if (err) return reject(err);
      if (!reply) return resolve(null);
      try {
        resolve(JSON.parse(reply));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

export const deleteOtp = (client: RedisClient, email: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    client.del(`otp:${email}`, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  });
};

