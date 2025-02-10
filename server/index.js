import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/uploads/images", express.static("uploads/images/"));
app.use("/uploads/recordings", express.static("uploads/recordings/"));
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(process.env.PORT, () => {
  console.log("server started on port:", process.env.PORT); //PORT = 3005
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // client's URL
  },
}); // Establlishing the socket

global.onlineUsers = new Map(); // a global map to maintain sockets and users. Will maintain online and offline status of the users. no reptative values

io.on("connection", (socket) => {
  // event "io.on" runs on new connection request
  global.chatSocket = socket; // set the socket in global chatSocket
  socket.on("add-user", (userId) => {
    // event "socket.on" runs on add-user event gets the userId(passed from frontend) and sets that userId and socket id inside onlineUsers
    console.log("add-user: ", userId);
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log("emmiting msg recieved to: ", sendUserSocket);
      socket.to(sendUserSocket).emit("msg-received", {
        from: data.from,
        to: data.to,
        message: data.message,
      });
    }
  });
});
