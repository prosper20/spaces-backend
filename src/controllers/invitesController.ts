import { Request, Response } from "express";
import { db } from "../db";

export const sendInvite = async (req: Request, res: Response) => {
  const { groupId, supervisorId } = req.body;
  try {
    const invite = await db.invite.create({
      data: {
        groupId,
        supervisorId,
        status: "PENDING",
      },
    });
    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: "Failed to send invite", error: err });
  }
};

export const respondToInvite = async (req: Request, res: Response) => {
  const { inviteId, status } = req.body;
  try {
    const updated = await db.invite.update({
      where: { id: inviteId },
      data: { status },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to respond to invite", error: err });
  }
};