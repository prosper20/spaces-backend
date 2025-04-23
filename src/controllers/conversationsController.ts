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


// export const newConversation = async (req: Request, res: Response) => {
//   const { groupId } = req.body;
//   if (!groupId) return res.status(400).json({ message: "Group ID is required" });

//   try {
//     const existingConversation = await db.conversation.findUnique({
//       where: { groupId },
//       include: {
//         participants: {
//           select: {
//             user: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 profile_picture: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (existingConversation) {
//       return res.status(200).json({
//         ...existingConversation,
//         participants: existingConversation.participants.map((p) => p.user),
//       });
//     }

//     const group = await db.group.findUnique({
//       where: { id: groupId },
//       include: { members: true },
//     });

//     if (!group) return res.status(404).json({ message: "Group not found" });

//     const conversation = await db.conversation.create({
//       data: {
//         groupId,
//         participants: {
//           create: group.members.map((member) => ({ userId: member.userId })),
//         },
//       },
//       include: {
//         participants: {
//           select: {
//             user: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 profile_picture: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     res.status(201).json({
//       ...conversation,
//       participants: conversation.participants.map((p) => p.user),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create conversation", error: err });
//   }
// };

// Get all conversations for the logged-in user
export const getAllConversations = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
        messages: {
          some: {},
        },
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

// Mark a conversation as read for the logged-in user
export const readConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  try {
    await db.conversationUser.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
    res.status(200).json({ message: "Conversation marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark conversation as read" });
  }
};
