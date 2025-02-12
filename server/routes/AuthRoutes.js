import express from "express";
import { checkUser, createUser,  generateToken,  getAllUsers } from "../controllers/AuthController.js";
const router = express.Router();

router.post("/check-user", checkUser);
router.post("/create-user", createUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
