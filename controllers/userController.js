import { User } from "../models/User/userModel.js";
import { Chapter } from "../models/Book/chapterModel.js";
import { Module } from "../models/Course/moduleModel.js";
import mongoose from "mongoose";
import { QuizSubmission } from "../models/quiz/quizsubmissoin.js";
import { Transaction } from "../models/Subscription/transactionModel.js";
import { Course } from "../models/Course/courseModel.js";
import { Book } from "../models/Book/bookModel.js";

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


// get all user 

export const getAllUser = async (req, res) => {
  try {
    const { search, role, subscription, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex }

      ];
    }
    if (subscription) {
      query.subscription = subscription;
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalData: total


    })


  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    })
  }


};

export const updateProfile = async (req, res) => {
  try {
    const { name, gender, className, institute, address } = req.body;
    const userId = req.user._id;

    // Validate the input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        gender,
        className,
        institute,
        address
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const overallStats = await QuizSubmission.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
          totalFailed: { $sum: { $cond: ["$passed", 0, 1] } },
          totalScore: { $sum: "$score" },
          averageScore: { $avg: "$score" },
          highestScore: { $max: "$score" },
          lowestScore: { $min: "$score" }
        }
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          totalPassed: 1,
          totalFailed: 1,
          averageScore: { $round: ["$averageScore", 2] },
          highestScore: 1,
          lowestScore: 1,
          overallPercentage: {
            $round: [
              { $multiply: ["$averageScore", 10] }, // Multiply by 10 since score is out of 10
              2
            ]
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Overall quiz statistics fetched successfully",
      data: overallStats[0] || {
        totalAttempts: 0,
        totalPassed: 0,
        totalFailed: 0,
        averageScore: 0,
        overallPercentage: 0,
        highestScore: 0,
        lowestScore: 0
      }
    });

  } catch (error) {
    console.error("Get user stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
};

export const getQuizStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Book Quiz Statistics
    const bookQuizStats = await QuizSubmission.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz' // Unwind the quiz array
      },
      {
        $match: {
          'quiz.chapterId': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          passedQuizzes: { $sum: { $cond: ["$passed", 1, 0] } },
          failedQuizzes: { $sum: { $cond: ["$passed", 0, 1] } },
          averageScore: { $avg: "$score" },
          highestScore: { $max: "$score" },
          totalQuizzes: { $addToSet: "$quizId" }
        }
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          passedQuizzes: 1,
          failedQuizzes: 1,
          averageScore: { $round: ["$averageScore", 2] },
          highestScore: 1,
          passPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$passedQuizzes", "$totalAttempts"] },
                  100
                ]
              }, 2
            ]
          },
          overallPercentage: {
            $round: [
              { $multiply: ["$averageScore", 10] },
              2
            ]
          },
          uniqueQuizzesTaken: { $size: "$totalQuizzes" }
        }
      }
    ]);

    // Course Quiz Statistics
    const courseQuizStats = await QuizSubmission.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz' // Unwind the quiz array
      },
      {
        $match: {
          'quiz.moduleId': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          passedQuizzes: { $sum: { $cond: ["$passed", 1, 0] } },
          failedQuizzes: { $sum: { $cond: ["$passed", 0, 1] } },
          averageScore: { $avg: "$score" },
          highestScore: { $max: "$score" },
          totalQuizzes: { $addToSet: "$quizId" }
        }
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          passedQuizzes: 1,
          failedQuizzes: 1,
          averageScore: { $round: ["$averageScore", 2] },
          highestScore: 1,
          passPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$passedQuizzes", "$totalAttempts"] },
                  100
                ]
              }, 2
            ]
          },
          overallPercentage: {
            $round: [
              { $multiply: ["$averageScore", 10] },
              2
            ]
          },
          uniqueQuizzesTaken: { $size: "$totalQuizzes" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Quiz statistics fetched successfully",
      data: {
        bookQuizzes: bookQuizStats[0] || {
          totalAttempts: 0,
          passedQuizzes: 0,
          failedQuizzes: 0,
          averageScore: 0,
          highestScore: 0,

          overallPercentage: 0,

        },
        courseQuizzes: courseQuizStats[0] || {
          totalAttempts: 0,
          passedQuizzes: 0,
          failedQuizzes: 0,
          averageScore: 0,
          highestScore: 0,

          overallPercentage: 0,

        }
      }
    });

  } catch (error) {
    console.error("Get quiz stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz statistics"
    });
  }
};

export const getWeeklyPerformance = async (req, res) => {
  try {
    const userId = req.user._id;
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyStats = await QuizSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz' // Unwind quiz array to access first element
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: {
              $cond: [
                { $ifNull: ['$quiz.chapterId', false] },
                'book',
                'course'
              ]
            }
          },
          attempts: { $sum: 1 },
          passed: { $sum: { $cond: ["$passed", 1, 0] } },
          failed: { $sum: { $cond: ["$passed", 0, 1] } },
          averageScore: { $avg: "$score" },
          highestScore: { $max: "$score" }
        }
      },
      // ...rest of your aggregation remains same...
    ]);

    return res.status(200).json({
      success: true,
      message: "Weekly performance fetched successfully",
      data: weeklyStats
    });

  } catch (error) {
    console.error("Get weekly performance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly performance"
    });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const { search, startDate, endDate, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    const role = req.user.role;
    const skip = (page - 1) * limit;

    // Build base query
    let query = {};
    if (role !== "admin") {
      query.userId = userId;
    }

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { "transactionId": searchRegex },
        { "paymentMethod": searchRegex }
      ];
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get transactions with populated fields
    const transactions = await Transaction.find(query)
      .populate('userId', 'name email phone')
      .populate('planId', 'name price duration')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Format transactions
    const formattedTransactions = transactions.map(t => ({
      _id: t._id,
      transactionId: t.transactionId,
      studentName: t.userId?.name || 'N/A',
      studentPhone: t.userId?.phone || 'N/A',
      amount: t.amount,
      paymentMethod: t.paymentMethod,
      status: t.status,
      createdAt: t.createdAt,
      plan: {
        name: t.planId?.name,
        price: t.planId?.price,
        duration: t.planId?.duration
      }
    }));

    const total = await Transaction.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully",
      data: {
        transactions: formattedTransactions,
        pagination: {
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          totalTransactions: total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Get transaction history error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction history",
      error: error.message
    });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalBooks, subscriptionStats] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Book.countDocuments(),
      User.aggregate([
        {
          $match: { role: 'student' }
        },
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            plan: '$_id',
            count: 1
          }
        }
      ])
    ]);

    const planCounts = {
      free: 0,
      basic: 0,
      standard: 0,
      premium: 0
    };

    subscriptionStats.forEach(stat => {
      if (stat.plan) {
        planCounts[stat.plan] = stat.count;
      }
    });

    return res.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalBooks,
        subscriptionStats: planCounts
      }
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch dashboard stats" 
    });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const revenueStats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          revenue: 1,
          transactions: 1
        }
      }
    ]);

    return res.json({
      success: true,
      data: {
        revenue: revenueStats[0]?.revenue || 0,
        transactions: revenueStats[0]?.transactions || 0
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics"
    });
  }
};