import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { transporter, generateOTP, setOtp, getOtp, deleteOtp } from "../lib/otp";
import { redisClient } from "../lib/redis";

interface Token {
  userId: string;
}

export type Role = "STUDENT" | "SUPERVISOR";

export const registerNewUser = async (req: Request, res: Response) => {
  const { fullName, email, password, passwordConfirm } = req.body;

  if (!fullName) return res.status(400).json({ message: "Full name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });
  const role: Role = req.body.role || 'STUDENT'

  if (password != passwordConfirm) return res.status(401).json({ message: "Passwords do not match" });

  try {
    const existingUser = await db.user.findFirst({ where: { email } });
    if (existingUser) return res.status(403).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiresInSec = 5 * 60;

    await setOtp(redisClient, email, otp, "verify", expiresInSec, {
      fullName,
      email,
      role,
      hashedPassword,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const verifyOtpAndCreateUser = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const stored = await getOtp(redisClient, email);

    if (!stored || stored.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (stored.action !== "verify" || !stored?.userData)
      return res.status(400).json({ message: "OTP not valid for registration" });

    const user = await db.user.create({
      data: {
        fullName: stored.userData.fullName,
        email: stored.userData.email,
        password: stored.userData.hashedPassword,
        role: stored.userData.role,
      },
    });

    await deleteOtp(redisClient, email);

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

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
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await db.user.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

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
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  try {
    const user = await db.user.findFirst({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (err || (decoded as Token).userId !== user.id)
        return res.status(403).json({ message: "Invalid token" });

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Token refresh failed" });
  }
};

export const handlePersistentLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  try {
    const user = await db.user.findFirst({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (err || (decoded as Token).userId !== user.id)
        return res.status(403).json({ message: "Invalid token" });

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profile_picture: user.profile_picture,
        role: user.role,
        accessToken,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Persistent login failed" });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;
  try {
    const user = await db.user.findFirst({ where: { refresh_token: refreshToken } });
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: { refresh_token: "" },
      });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
};