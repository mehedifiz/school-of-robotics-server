import express from "express";
import { createAdmin, loginUser, registerUser, verifyOtp } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Register a new user
authRouter.post("/register", registerUser);

// Login user
authRouter.post("/login", loginUser);
authRouter.post("/verify-otp" , verifyOtp)

authRouter.post("/create-admin" , auth("admin") , createAdmin)

export default authRouter;