import { Request, Response } from "express";
import { db } from "../db";


export const newMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  const { conversationId } = req.params;

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
    res.status(500).json({ message: "Failed to send message", error: err });
  }
};


export const getMessagesInConversation = async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query;
  const { conversationId } = req.params;

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const currentUserId = req.userId;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    const isParticipant = conversation?.participants.some(
      (p) => p.userId === currentUserId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.conversationUser.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: currentUserId,
        },
      },
      data: { isRead: true },
    });

    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { created_at: "desc" },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages", error: err });
  }
};
