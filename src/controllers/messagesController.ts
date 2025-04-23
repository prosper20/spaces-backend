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



// export const newMessage = async (req: Request, res: Response) => {
//   const { message, conversationId } = req.body;

//   if (!message || message.trim() === "")
//     return res.status(400).json({ message: "Must provide a message" });
//   if (!conversationId)
//     return res.status(400).json({ message: "Must provide a conversationId" });

//   const authorId = req.userId;

//   try {
//     const newMessage = await db.message.create({
//       data: {
//         message,
//         authorId,
//         conversationId,
//       },
//       include: {
//         conversation: {
//           include: {
//             participants: true,
//           },
//         },
//       },
//     });

//     await db.conversation.update({
//       where: { id: conversationId },
//       data: { dateLastMessage: new Date() },
//     });

//     await Promise.all(
//       newMessage.conversation?.participants.map((participant) => {
//         if (participant.userId !== authorId) {
//           return db.conversationUser.update({
//             where: {
//               conversationId_userId: {
//                 conversationId,
//                 userId: participant.userId,
//               },
//             },
//             data: { isRead: false },
//           });
//         }
//       }) ?? []
//     );

//     res.status(200).json({
//       id: newMessage.id,
//       message: newMessage.message,
//       authorId: newMessage.authorId,
//       created_at: newMessage.created_at,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err });
//   }
// };

// Get all messages in a conversation
export const getMessagesInConversation = async (req: Request, res: Response) => {
  const { conversationId, page = 1, limit = 10 } = req.query;

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const currentUserId = req.userId;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId as string },
      include: { participants: true },
    });

    const isParticipant = conversation?.participants.some(
      (p) => p.userId === currentUserId
    );

    if (!isParticipant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await db.conversationUser.update({
      where: {
        conversationId_userId: {
          conversationId: conversationId as string,
          userId: currentUserId,
        },
      },
      data: { isRead: true },
    });

    const messages = await db.message.findMany({
      where: {
        conversationId: conversationId as string,
      },
      orderBy: { created_at: "desc" },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

// Edit a message
export const editMessage = async (req: Request, res: Response) => {
  const { message: newMessageBody } = req.body;
  const messageId = req.params.id;

  if (!newMessageBody || newMessageBody.trim() === "")
    return res.status(400).json({ message: "Message cannot be empty" });

  try {
    const message = await db.message.findUnique({ where: { id: messageId } });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.authorId !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own messages" });
    }

    const updatedMessage = await db.message.update({
      where: { id: messageId },
      data: {
        message: newMessageBody,
        isEdited: true,
      },
    });

    res.status(200).json({ updatedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
  const messageId = req.params.id;

  try {
    const message = await db.message.findUnique({ where: { id: messageId } });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.authorId !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await db.message.delete({ where: { id: messageId } });

    res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
