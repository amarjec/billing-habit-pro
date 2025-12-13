import express from 'express';
import { 
    googleLogin, 
    getUserProfile, 
    logoutUser, 
    updateUserDetails, 
    verifyPin 
} from '../controllers/userController.js';
import userAuth from '../middlewares/userAuth.js';

const userRouter = express.Router();

// --- Public Routes ---
userRouter.post('/google-login', googleLogin);

// --- Protected Routes (Requires Login) ---
userRouter.get('/profile', userAuth, getUserProfile);

// This is the "Onboarding" route (Saves Shop Name, Address, Number, PIN)
userRouter.post('/update-details', userAuth, updateUserDetails);

// For Profit Hiding/Admin Actions
userRouter.post('/verify-pin', userAuth, verifyPin);

userRouter.post('/logout', userAuth, logoutUser);

export default userRouter;
