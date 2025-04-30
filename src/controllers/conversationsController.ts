import { Request, Response } from "express";
import { db } from "../db";

// Get all conversations for the logged-in user
export const getAllConversations = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
        // messages: {
        //   some: {},
        // },
      },
      select: {
        id: true,
        title: true,
        groupId: true,
        messages: {
          select: {
            id: true,
            message: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
        participants: {
          select: {
            isRead: true,
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
      orderBy: {
        dateLastMessage: "desc",
      },
    });

    const response = conversations.map((conversation) => {
      const currentUserReadStatus = conversation.participants.find(
        (p) => p.user.id === userId
      )?.isRead;

      return {
        ...conversation,
        lastMessageSent: conversation.messages[0],
        messages: undefined,
        participants: conversation.participants.map((p) => p.user),
        isRead: currentUserReadStatus ?? true,
      };
    });

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve conversations" });
  }
};

export const getConversationById = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        title: true,
        groupId: true,
        messages: {
          select: {
            id: true,
            message: true,
            created_at: true,
            author: {
              select: {
                id: true,
                fullName: true,
                profile_picture: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
          take: 20,
        },
        participants: {
          select: {
            user: {
              select: {
                id: true,
                fullName: true,
                profile_picture: true,
              },
            },
            isRead: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.user.id === userId
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      ...conversation,
      participants: conversation.participants.map((p) => p.user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
};
