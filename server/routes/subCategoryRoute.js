import express from 'express';
import { createSubCategory, deleteSubCategory, getSubCategoriesForCategory,getSubCategoryById, updateSubCategory } from '../controllers/subCategoryController.js';
import userAuth from '../middlewares/userAuth.js'; // Assuming you have this auth middleware

const subCategoryRouter = express.Router();

// All routes are protected by auth middleware
subCategoryRouter.use(userAuth);

// POST /api/subcategory/create
subCategoryRouter.post('/create', createSubCategory);

// GET /api/subcategory/get-for-category/:categoryId
subCategoryRouter.get('/get-for-category/:categoryId', getSubCategoriesForCategory);

// GET /api/subcategory/get/:id
subCategoryRouter.get('/get/:id', getSubCategoryById);

subCategoryRouter.put('/update/:subCategoryId', userAuth, updateSubCategory);
subCategoryRouter.delete('/delete/:subCategoryId', userAuth, deleteSubCategory);

export default subCategoryRouter;

