import { User } from "../models/User/userModel.js";
import { Chapter } from "../models/Book/chapterModel.js";
import { Module } from "../models/Course/moduleModel.js";
import mongoose from "mongoose";
export const getUserByID = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId and return proper error message
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: ${userId}`
      });
    }

    // Convert string to ObjectId and find user
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId)
      .select('-password')
      .populate('progress.chapterId')
      .populate('progress.moduleId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user",
      error: error.message
    });
  }
};