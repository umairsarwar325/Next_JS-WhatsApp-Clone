import express from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  getInitialContactsWithMessages,
  getMessages,
} from "../controllers/MessageController.js";
import multer from "multer";
const router = express.Router();

const uploadImage = multer({ dest: "uploads/images" });
const uploadaAudio= multer({ dest: "uploads/recordings" });

router.post("/add-message", addMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadaAudio.single("audio"), addAudioMessage);
router.get("/get-messages/:from/:to", getMessages);
router.get("/get-initial-contacts/:userId", getInitialContactsWithMessages);

export default router;
