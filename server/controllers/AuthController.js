import getPrismaInstance from "../utils/PrismaClient.js";

const checkUser = async (req, res, next) => {
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

export { checkUser };
