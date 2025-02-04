import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(process.env.PORT, () => {
  console.log("server started on port:", process.env.PORT);
});

global.onlineUsers = new Map();
