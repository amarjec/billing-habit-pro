import Razorpay from 'razorpay';
import crypto from 'crypto';
import userModel from '../models/userModel.js';

const plans = {
    'monthly': { amount: process.env.MONTHLY_BILLING_PRICE, days: process.env.MONTHLY_BILLING_DAYS || 30 },
    'yearly': { amount: process.env.ANNUAL_BILLING_PRICE , days: process.env.ANNUAL_BILLING_DAYS || 365 }
};

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order
export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.userId;

        const plan = plans[planId];
        if (!plan) return res.status(400).json({ success: false, message: "Invalid Plan" });

        const options = {
            amount: plan.amount * 100,
            currency: "INR",
            receipt: `rec_${Date.now()}`,
            notes: { userId, planId }
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Verify & Activate (Fixed Logic)
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
        const userId = req.userId;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

        // --- ACTIVATE SUBSCRIPTION ---
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // SECURITY CHECK: Prevent Double Processing
        if (user.lastOrderId === razorpay_order_id) {
            return res.status(200).json({ success: true, message: "Already Activated", user });
        }

        const plan = plans[planId];
        const currentDate = new Date();
        
        // Logic: If already active, extend from Expiry. If expired/free, start from Now.
        let startDate = currentDate;
        if (user.isPremium && user.expiryDate && new Date(user.expiryDate) > currentDate) {
            startDate = new Date(user.expiryDate);
        }

        // --- SAFE TIMESTAMP MATH ---
        // 1 day = 86,400,000 milliseconds
        const durationInMillis = plan.days * 24 * 60 * 60 * 1000;
        const newExpiry = new Date(startDate.getTime() + durationInMillis);

        // Update User
        user.isPremium = true;
        user.planType = planId;
        user.expiryDate = newExpiry;
        user.lastOrderId = razorpay_order_id; // Save Order ID
        
        await user.save();

        res.json({ success: true, message: "Premium Activated!", user });

    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};