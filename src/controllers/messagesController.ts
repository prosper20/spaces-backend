import { Request, Response } from "express";
import { db } from "../db";

export const newMessage = async (req: Request, res: Response) => {
  const { message, conversationId } = req.body;

  if (!message || message.trim() === "")
    return res.status(400).json({ message: "Must provide a message" });
  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const authorId = req.userId;

  try {
    const newMessage = await db.message.create({
      data: {
        message,
        authorId,
        conversationId,
      },
      include: {
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    await db.conversation.update({
      where: { id: conversationId },
      data: { dateLastMessage: new Date() },
    });

    await Promise.all(
      newMessage.conversation?.participants.map((participant) => {
        if (participant.userId !== authorId) {
          return db.conversationUser.update({
            where: {
              conversationId_userId: {
                conversationId,
                userId: participant.userId,
              },
            },
            data: { isRead: false },
          });
        }
      }) ?? []
    );

    res.status(200).json({
      id: newMessage.id,
      message: newMessage.message,
      authorId: newMessage.authorId,
      created_at: newMessage.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
