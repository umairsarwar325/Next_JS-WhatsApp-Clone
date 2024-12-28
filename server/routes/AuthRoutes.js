import express from "express";
import { checkUser, createUser, getAllUsers } from "../controllers/AuthController.js";
const router = express.Router();

router.post("/check-user", checkUser);
router.post("/create-user", createUser);
router.get("/get-contacts", getAllUsers);

export default router;
