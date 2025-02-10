import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";

export const addMessage = async (req, res) => {
  try {
    const { message, from, to } = req.body;
    if (!message || !from || !to) {
      return res.status(400).json({
        status: false,
        message: "Message data is missing",
      });
    }
    const prismaInstance = getPrismaInstance();
    const getUser = onlineUsers.get(to); // checks if reciever is online
    const newMessage = await prismaInstance.Messages.create({
      data: {
        message,
        sender: { connect: { id: from } },
        receiver: { connect: { id: to } },
        messageStatus: getUser ? "delivered" : "sent",
      },
      include: { sender: true, receiver: true },
    });
    return res.status(201).json({
      status: true,
      message: newMessage,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
export const addImageMessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "File not found",
      });
    }
    if (!from || !to) {
      return res.status(400).json({
        status: false,
        message: "inavlid sender or receiver",
      });
    }
    const date = Date.now();
    let fileName = "uploads/images/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const prismaInstance = getPrismaInstance();
    const getUser = onlineUsers.get(to);
    const newMessage = await prismaInstance.Messages.create({
      data: {
        message: fileName,
        sender: { connect: { id: from } },
        receiver: { connect: { id: to } },
        type: "image",
        messageStatus: getUser ? "delivered" : "sent",
      },
      include: { sender: true, receiver: true },
    });
    return res.status(201).json({
      status: true,
      message: newMessage,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
export const addAudioMessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Audio not found",
      });
    }
    if (!from || !to) {
      return res.status(400).json({
        status: false,
        message: "inavlid sender or receiver",
      });
    }
    const date = Date.now();
    let fileName = "uploads/recordings/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const prismaInstance = getPrismaInstance();
    const getUser = onlineUsers.get(to);
    const newMessage = await prismaInstance.Messages.create({
      data: {
        message: fileName,
        sender: { connect: { id: from } },
        receiver: { connect: { id: to } },
        type: "audio",
        messageStatus: getUser ? "delivered" : "sent",
      },
      include: { sender: true, receiver: true },
    });
    return res.status(201).json({
      status: true,
      message: newMessage,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { from, to } = req.params;
    const prismaInstance = getPrismaInstance();
    const messages = await prismaInstance.Messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            receiverId: to,
          },
          {
            senderId: to,
            receiverId: from,
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    const unreadMessages = [];
    for (const [index, message] of messages.entries()) {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    }
    if (unreadMessages.length > 0) {
      await prismaInstance.Messages.updateMany({
        where: {
          id: { in: unreadMessages },
        },
        data: {
          messageStatus: "read",
        },
      });
    }
    return res.status(201).json({
      status: true,
      messages,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
export const getInitialContactsWithMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const prismaInstance = getPrismaInstance();
    const user = await prismaInstance.User.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: { receiver: true, sender: true },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: { receiver: true, sender: true },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const messages = [...user.sentMessages, ...user.receivedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "sent" && !isSender) {
        messageStatusChange.push(msg.id);
      }
      if (!users.get(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        } = msg;
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, { ...user });
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length > 0) {
      await prismaInstance.Messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }
    return res.status(200).json({
      status: true,
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
