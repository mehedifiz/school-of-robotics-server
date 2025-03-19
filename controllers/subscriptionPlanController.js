import { SubscriptionPlan } from "../models/Subscription/subscriptionPlanModel.js";

// Create new subscription plan (Admin only)
export const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features, resourceAccess, description } = req.body;

    const newPlan = await SubscriptionPlan.create({
      name,
      price,
      duration,
      features,
      resourceAccess,
      description
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: newPlan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ price: 1 });

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update subscription plan (Admin only)
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent name modification
    if (updates.name) {
      delete updates.name;
    }

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};