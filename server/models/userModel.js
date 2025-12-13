
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    shopName: { type: String, default: "" },
    number: { type: String, default: "" },
    address: { type: String, default: "" },
    pin: { type: String }, 

    // Subscription Fields
    isPremium: { type: Boolean, default: false },
    planType: { type: String, enum: ['free', 'monthly', 'yearly', 'trial'], default: 'free' },
    expiryDate: { type: Date, default: null },
    
    // NEW: To prevent double payment processing
    lastOrderId: { type: String, default: null } 

}, { timestamps: true });

// ... (Keep your pre-save hook for PIN hashing here) ...
userSchema.pre('save', async function(next) {
    if (!this.isModified('pin')) return next();
    if (this.pin) {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
    }
    next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;