import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({
        status: false,
        message: "Email is required",
      });
    }
    const prismaInstance = getPrismaInstance();

    const userFormDb = await prismaInstance.User.findUnique({
      where: { email },
    });

    if (!userFormDb) {
      return res.json({
        status: false,
        message: "User not found",
      });
    } else {
      return res.json({
        status: true,
        message: "User found",
        data: userFormDb,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
const createUser = async (req, res) => {
  try {
    const { email, name, about, profilePicture } = req.body;
    if (!email || !name || !profilePicture) {
      return res.json({
        status: false,
        message: "Email, name and profile picture are required",
      });
    }
    const prismaInstance = getPrismaInstance();
    const userFormDb = await prismaInstance.User.findUnique({
      where: { email },
    });

    if (userFormDb) {
      return res.json({
        status: false,
        message: "User already registered",
      });
    }
    const newUser = await prismaInstance.User.create({
      data: {
        email,
        name,
        about,
        profilePicture,
      },
    });

    if (newUser) {
      return res.json({
        status: true,
        message: "User created successfully",
        data: newUser,
      });
    } else {
      return res.json({
        status: false,
        message: "User could not be created",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const prismaInstance = getPrismaInstance();
    const users = await prismaInstance.User.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });

    if (users) {
      let usersGroupByIntialLetter = {};
      users?.forEach((user) => {
        const intialLetter = user.name.charAt(0).toUpperCase();
        if (!usersGroupByIntialLetter[intialLetter]) {
          usersGroupByIntialLetter[intialLetter] = [];
        }
        usersGroupByIntialLetter[intialLetter].push(user);
      });

      return res.json({
        status: true,
        message: "User created successfully",
        userGroup: usersGroupByIntialLetter,
      });
    } else {
      return res.json({
        status: false,
        message: "Error finding users",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: "Internel server error",
    });
  }
};
const generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SEVER_ID;
    const { userId } = req.params;
    const effectiveTime = 3600; // Token validity time in seconds
    const payload = ""; // Optional payload

    // Validate required inputs
    if (!appId || !serverSecret || !userId) {
      return res.status(400).json({
        status: false,
        message: "Missing data for token generation (appId, serverSecret, or userId).",
      });
    }

    // Generate the token
    const token = generateToken04(
      appId,
      userId,
      serverSecret,
      effectiveTime,
      payload
    );

    // Return the token
    return res.status(200).json({
      status: true,
      token,
    });
  } catch (error) {
    console.error("Error generating token:", error);

    // Handle specific errors thrown by generateToken04
    if (error.errorCode) {
      return res.status(400).json({
        status: false,
        message: error.errorMessage || "Invalid input for token generation.",
      });
    }

    // Handle generic errors
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export { checkUser, createUser, getAllUsers, generateToken };
