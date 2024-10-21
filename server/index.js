import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("server listening");
});

const server = app.listen(3005, () => {
  console.log("server started");
});
