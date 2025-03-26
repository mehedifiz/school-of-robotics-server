import axios from "axios";
import { SubscriptionPlan } from "../models/Subscription/subscriptionPlanModel.js";
import { User } from "../models/User/userModel.js";
import { ObjectId } from "mongodb";
import SSLCommerzPayment from "sslcommerz-lts";
import { PaymentSession } from "../models/Subscription/paymentSessionModel.js";
import { Transaction } from "../models/Subscription/transactionModel.js";




// Create new subscription plan (Admin only)
export const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features,   description } = req.body;

    const newPlan = await SubscriptionPlan.create({
      name,
      price,
      duration,
      features,
       
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

//get only one data by id
export const getAPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findById(id)

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'plan not found!'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Plan fetched successfully!',
      data: plan
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

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


export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Plan deleted successfully!'
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!'
    })
  }
}



// // Payment route
// import SSLCommerzPayment from 'sslcommerz-lts';
// import { v4 as uuidv4 } from 'uuid';

 
export const createSslPayment = async (req, res) => {
  try {
    const { planId } = req.body;

    // Fetch user data
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validate plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found"
      });
    }

    // SSL Commerz config
    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      false
    );

    // Generate unique transaction ID
    const tranId = new ObjectId().toString();

    // Ensure all values are strings
    const data = {
      total_amount: plan.price.toString(),
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${process.env.SERVER_URL}/api/plan/success-payment`,
      fail_url: `${process.env.API_URL}/payment/failed`,
      cancel_url: `${process.env.API_URL}/api/subscription/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL}/api/subscription/payment/ipn`,
      shipping_method: 'NO',
      product_name: String(plan.name),
      product_category: 'Subscription',
      product_profile: 'non-physical-goods',
      cus_name: String(user.name),
      cus_phone: String(user.phone),
      cus_email: 'noemail@example.com',
      cus_add1: 'Bangladesh',
      cus_city: 'Bangladesh',
      cus_country: 'Bangladesh',
      value_a: user._id.toString(),
      value_b: planId.toString(),
      value_c: plan.duration.toString()
    };

    // Initialize payment
    const paymentSession = await sslcz.init(data);
    
    if (!paymentSession?.GatewayPageURL) {
      return res.status(400).json({
        success: false,
        message: "Payment session creation failed"
      });
    }

    return res.status(200).json({
      // paymentSession,
      success: true,
      message: "Payment session created",
      data: {
        paymentUrl: paymentSession.GatewayPageURL,
        tranId,
        planDetails: {
          name: plan.name,
          price: plan.price,
          duration: plan.duration
        }
      }
    });

  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
      error: error.message
    });
  }
};
 

 //success payment
 export const paymentSuccess = async (req, res) => {
  try {

    const { 
      val_id, 
      tran_id, 
      amount, 
      value_a, 
      value_b,
      card_type,
      bank_tran_id,
      card_issuer,
      card_brand 
    } = req.body;

    // Initialize SSL Commerz
    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      false // For sandbox, use true for production
    );

    try {
      // Validate the transaction
      const validationData = await sslcz.validate({
        val_id: val_id.toString(), // Ensure val_id is string
      });


      if (validationData?.status !== 'VALID') {
        console.log('Invalid Transaction:', validationData);
        return res.redirect(`${process.env.CLIENT_URL}/payment/failed?reason=validation_failed`);
      }

      // // If validation successful, update user subscription
      const userId = value_a;
      const planId = value_b;

      const plan = await SubscriptionPlan.findById(planId);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);

      // // Update user subscription
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          subscription: {
            plan: plan.name,
            startDate,
            endDate,
            transactionId: tran_id,
            validationId: val_id,
            amount: amount,
            status: 'active',
          }
        },
        { new: true }
      );

      await Transaction.create({
        userId,
        planId,
        planName: plan.name,
        amount: Number(amount),
        transactionId: tran_id,
        validationId: val_id,
        paymentMethod: card_type,
        startDate,
        expiryDate: endDate,
        paymentDetails: {
          cardType: card_type,
          bankTransId: bank_tran_id,
          cardIssuer: card_issuer,
          cardBrand: card_brand
        }
      });

      

    

      return res.redirect(`${process.env.API_URL}/payment/success?transactionId=${tran_id}`);

    } catch (error) {
      console.error('Transaction creation error:', error);
      return res.redirect(`${process.env.API_URL}/payment/failed?reason=transaction_save_error`);
    }


  } catch (error) {
    console.error('Payment Success Handler Error:', error);
    return res.redirect(`${process.env.API_URL}/payment/failed?reason=server_error`);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ transactionId })
      .populate('userId', 'name phone')
      .populate('planId', 'name price duration');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction
    });

  } catch (error) {
    console.error("Get transaction error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction"
    });
  }
};