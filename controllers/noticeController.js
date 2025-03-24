import { Notice } from "../models/noticeModel.js";

export const createNotice = async (req, res) => {
  try {
    const { title, description, targetPlans } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    const notice = await Notice.create({
      title,
      description,
      targetPlans: targetPlans || [], 
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice
    });

  } catch (error) {
    console.error("Create notice error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create notice"
    });
  }
};

 

export const getNotices = async (req, res) => {
  try {
     
    if (req.user.role === 'admin') {
      const notices = await Notice.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name');

      return res.status(200).json({
        success: true,
        message: "All notices fetched successfully",
        data: notices
      });
    }

   
    const userPlan = req.user?.subscription?.plan || "free";
    const notices = await Notice.find({
      $or: [
        { targetPlans: { $size: 0 } },
        { targetPlans: userPlan }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name');

    return res.status(200).json({
      success: true,
      message: "Notices fetched successfully",
      data: notices
    });

  } catch (error) {
    console.error("Get notices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notices"
    });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { title, description, targetPlans } = req.body;

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      noticeId,
      {
        title,
        description,
        targetPlans: targetPlans || []
      },
      { new: true }
    ).populate('createdBy', 'name');

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: updatedNotice
    });

  } catch (error) {
    console.error("Update notice error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notice"
    });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findByIdAndDelete(noticeId);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully"
    });

  } catch (error) {
    console.error("Delete notice error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notice"
    });
  }
};