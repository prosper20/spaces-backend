import { Request, Response } from "express";
import { db } from "../db";

export const newConversation = async (req: Request, res: Response) => {
  const { groupId } = req.body;
  if (!groupId) return res.status(400).json({ message: "Group ID is required" });

  try {
    const existingConversation = await db.conversation.findUnique({
      where: { groupId },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                fullName: true,
                profile_picture: true,
              },
            },
          },
        },
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        ...existingConversation,
        participants: existingConversation.participants.map((p) => p.user),
      });
    }

    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    const conversation = await db.conversation.create({
      data: {
        groupId,
        participants: {
          create: group.members.map((member) => ({ userId: member.userId })),
        },
      },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                fullName: true,
                profile_picture: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      ...conversation,
      participants: conversation.participants.map((p) => p.user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create conversation", error: err });
  }
};
