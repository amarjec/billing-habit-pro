import userModel from "../models/userModel.js";

const premiumAuth = async (req, res, next) => {
    try {
        // req.userId is set by the previous userAuth middleware
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // --- THE GATEKEEPER ---
        if (user.isPremium) {
            next(); // Allowed
        } else {
            return res.json({ 
                success: false, 
                message: "Trial Expired. Please Upgrade.",
                code: "PLAN_EXPIRED" // Special code for Frontend to detect
            });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default premiumAuth;