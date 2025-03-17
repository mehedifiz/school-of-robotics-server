import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User/userModel.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    // Check if user already exists with this phone number
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role: "student", // Default role
    });
    
    // Save user to database
    await newUser.save();
    
    // Return success response (without sending password)
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    // Return user data and token (without password)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(200).json({
      message: "Login successful",
      user: userObject,
      token
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const test = async (req, res) => {
  try {
    // Check if user exists in request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No user found in request"
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Test successful",
      data: {
        userId: req.user._id,
        role: req.user.role
      }
    });

  } catch (error) {
    console.error("Test endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error in test endpoint"
    });
  }
};