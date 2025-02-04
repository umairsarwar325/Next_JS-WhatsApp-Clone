import express from "express";
import { addMessage, getMessages } from "../controllers/MessageController.js";

const router = express.Router();

router.post("/add-message", addMessage);
router.get("/get-messages", getMessages);

export default router;
