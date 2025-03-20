import { Book } from "../models/Book/bookModel.js";
import { Chapter } from "../models/Book/chapterModel.js";
import { QuizSubmission } from "../models/quiz/quizsubmissoin.js";
import { User } from "../models/User/userModel.js";

// Create a new book (Admin only)
export const createBook = async (req, res) => {
  try {
    const { name, description, thumbnail, plan } = req.body;

    if (!name || !description || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newBook = new Book({
      name,
      description,
      thumbnail,
      plan,
      createdBy: req.user._id
    });

    await newBook.save();

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create book"
    });
  }
};

// Get all books based on user's plan
export const getAllBooks = async (req, res) => {
  try {
    // If user is admin, return all books
    if (req.user.role === 'admin') {
      const books = await Book.find();
      return res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        data: books
      });
    }

    const user = await User.findById(req.user._id);
    const now = new Date();
    const subscriptionEndDate = user.subscription?.endDate;
    const subscriptionStartDate = user.subscription?.startDate;

    // Get books based on subscription period and plan
    const books = await Book.find({
      $and: [
        { plan: user?.subscription?.plan },
        {
          createdAt: {
            $gte: subscriptionStartDate,
            $lte: subscriptionEndDate || now
          }
        }
      ]
    }).select('-createdBy');

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
      subscription: {
        plan: user.subscription.plan,
        isActive: subscriptionEndDate > now,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate
      }
    });

  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books"
    });
  }
};

// Get single book details
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("book Id ", id)
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // If user is admin, return book without plan check
    if (req.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        message: "Book details fetched successfully",
        data: book
      });
    }
    const user = await User.findById(req.user._id);
    // console.log(user)


    // For regular users, check plan access
    const userPlan = user.subscription.plan || "free";
    const planAccess = {
      basic: ["basic"],
      standard: ["basic", "standard"],
      premium: ["basic", "standard", "premium"]
    };

    if (!planAccess[userPlan].includes(book.plan)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this book"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book details fetched successfully",
      data: book
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book details"
    });
  }
};


 

  // Add chapter
export const addChapter = async (req, res) => {
  try {
    const { bookId, title, chapterNo, pdfUrl } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if chapter number already exists for this book
    const existingChapter = await Chapter.findOne({ bookId, chapterNo });
    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter number already exists for this book"
      });
    }

    const newChapter = await Chapter.create({
      title,
      chapterNo,
      bookId,
      pdfUrl
    });

    return res.status(201).json({
      success: true,
      message: "Chapter added successfully",
      data: newChapter
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add chapter",
      error: error.message
    });
  }
};

// get chapters
export const getChapter = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if(!book) {
      return res.status(400).json({
        success: false,
        message: "Book not found"
      });
    }

    // Get all chapters with their quizzes
    const chapters = await Chapter.find({ bookId })
      .sort({ chapterNo: 1 })
      .populate({
        path: 'quizId',
        select: 'title questions'
      });

    // Get this user's quiz submissions for this book's chapters
    const quizIds = chapters
      .filter(chapter => chapter.quizId) // Only chapters with quizzes
      .map(chapter => chapter.quizId?._id); // Get quiz IDs

      console.log("quizids" , quizIds , "uederid", req.user?._id);

    const userSubmissions = await QuizSubmission.find({
      userId: req.user?._id,
      quizId: { $in: quizIds }
    });
    console.log('userSubmissions',userSubmissions)

    // Mark chapters as completed based on quiz submissions
    const chaptersWithProgress = chapters.map(chapter => {
      // For each chapter, check if user submitted its quiz
      const hasSubmittedQuiz = userSubmissions.some(
        submission => submission.quizId.toString() === chapter.quizId?._id.toString()
      );

      return {
        ...chapter.toObject(),
        quizSubmitted: hasSubmittedQuiz
      };
    });

    return res.status(200).json({
      success: true,
      message: "Chapters fetched successfully",
      data: chaptersWithProgress
    });

  } catch (error) {
    console.error("Fetch chapters error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chapters"
    });
  }
};