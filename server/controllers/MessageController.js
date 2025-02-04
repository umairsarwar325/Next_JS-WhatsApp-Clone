import getPrismaInstance from "../utils/PrismaClient.js";

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
    const getUser = onlineUsers.get(from); // checks if reciever is online
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
    await prismaInstance.Messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });
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
