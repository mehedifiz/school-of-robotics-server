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

// delete book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // // Get all chapters for this book
    const chapters = await Chapter.find({ bookId: id });
    const chapterIds = chapters.map(chapter => chapter._id);



    // // Delete all chapters
    await Chapter.deleteMany({ bookId: id });

    // Delete the book
    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Book and all related data deleted successfully"
    });
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message
    });
  }
};

// Update book details
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, description, thumbnail, plan } = req.body;

    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if user is admin (optional if already handled by middleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can update books"
      });
    }

    // Create update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (author) updateData.author = author;
    if (description) updateData.description = description;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (plan) updateData.plan = plan;

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook
    });
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message
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

    // Create new chapter
    const newChapter = await Chapter.create({
      title,
      chapterNo,
      bookId,
      pdfUrl
    });

    // Add chapter reference to book's chapters array
    await Book.findByIdAndUpdate(
      bookId,
      { $push: { chapters: newChapter._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Chapter added successfully",
      data: newChapter
    });

  } catch (error) {
    console.error("Add chapter error:", error);
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
    if (!book) {
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

    console.log("quizids", quizIds, "uederid", req.user?._id);

    const userSubmissions = await QuizSubmission.find({
      userId: req.user?._id,
      quizId: { $in: quizIds }
    });
    console.log('userSubmissions', userSubmissions)

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


export const updateChapter = async (req, res) => {
  const chapterId = req.params.chapterId

  const { title, pdfUrl } = req.body;

  try {

    const chapter = await Chapter.findOne({ _id: chapterId })
    console.log("chapter", chapter)
    if (!chapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter not found"
      });
    }

    const updateChapter = await Chapter.findByIdAndUpdate(chapterId, { title, pdfUrl },
      { new: true }
    )

    console.log("updateChapter", updateChapter)

    return res.status(200).json({
      success: true,
      message: "Chapter updated successfully",

    })

  } catch (error) {

    console.error("Update chapter error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update chapter",
      error: error.message
    });

  }


}

export const deleteChapter = async(req , res)=>{
  const {chapterId}= req.params;

  console.log("chapterId", chapterId)

  try {

    const result = await Chapter.findByIdAndDelete(chapterId);
    console.log("result", result)


      
      if(result){

        const bookId = result.bookId;

        const removechapter = await Book.findByIdAndUpdate(bookId ,{$pull:{chapters:chapterId}})

        // console.log("removechapter", removechapter)

        return res.status(200).json({
          success:true,
          message:"Chapter deleted successfully",
        })
      }
    
      if(!result){
        return res.status(400).json({
          success:false,
          message:"Chapter not found"
        })
      }
    
    
  }  catch(error){
    res.status(500).json({
      success:false,
      message:"Failed to delete chapter",
      error:error.message
    })
  }
   
    }