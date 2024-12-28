import { PrismaClient } from "@prisma/client";

let prismaInstance = null;

const getPrismaInstance = () => {
  try {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient();
    }
    return prismaInstance;
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
};

export default getPrismaInstance;
