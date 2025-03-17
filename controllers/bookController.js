import { Book } from "../models/Book/bookModel.js";

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
    if (req?.user?.role === 'admin') {
      const books = await Book.find();
      return res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        data: books
      });
    }

    // For regular users, filter by plan
    const userPlan = req.user.subscription || "basic";
    const planAccess = {
      basic: ["basic"],
      standard: ["basic", "standard"],
      premium: ["basic", "standard", "premium"]
    };

    const books = await Book.find({ 
      plan: { $in: planAccess[userPlan] } 
    }).select('-createdBy');

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books
    });
  } catch (error) {
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
    console.log("book Id " , id)
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

    // For regular users, check plan access
    const userPlan = req.user.subscription || "basic";
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