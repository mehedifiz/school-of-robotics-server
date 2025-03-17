import express from "express";
import { loginUser, registerUser, test } from "../controller/authController.js";
import auth from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Register a new user
authRouter.post("/register", registerUser);

// Login user
authRouter.post("/login", loginUser);

export default authRouter;