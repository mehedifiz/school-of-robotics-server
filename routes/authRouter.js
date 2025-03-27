import express from "express";
import { changePassword, createAdmin, forgotPassword, getAllAdmins, loginUser, registerUser, resetPassword, verifyOtp } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Register a new user
authRouter.post("/register", registerUser);

// Login user
authRouter.post("/login", loginUser);
authRouter.post("/verify-otp" , verifyOtp)

authRouter.post("/create-admin" , auth("admin") , createAdmin)

authRouter.get("/admins" , auth("admin") , getAllAdmins
)
authRouter.post("/change-password", auth("student", "admin"), changePassword);

// Forgot Password Routes
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;