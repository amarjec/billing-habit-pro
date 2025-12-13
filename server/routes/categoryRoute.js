import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js';
import userAuth from '../middlewares/userAuth.js'; // Your auth middleware

const categoryRouter = express.Router();

// --- All routes are protected ---
// This ensures only logged-in users can create or view categories
categoryRouter.use(userAuth);

// POST /api/category/create
categoryRouter.post('/create', createCategory);

// GET /api/category/get-all
categoryRouter.get('/get-all', getAllCategories);
categoryRouter.get('/get/:id', getCategoryById);

categoryRouter.put('/update/:categoryId', userAuth, updateCategory);
categoryRouter.delete('/delete/:categoryId', userAuth, deleteCategory);

export default categoryRouter;

