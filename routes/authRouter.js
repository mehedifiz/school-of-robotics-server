import express from "express";
import { loginUser, registerUser } from "../controller/authController.js";

const authRouter = express.Router();

// Register a new user
authRouter.post("/register", registerUser);

// Login user
authRouter.post("/login", loginUser);

export default authRouter;