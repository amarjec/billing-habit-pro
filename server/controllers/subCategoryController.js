import subCategoryModel from "../models/subCategoryModel.js";
import productModel from "../models/productModel.js";

// --- 1. Create a New SubCategory (a "Row") ---
export const createSubCategory = async (req, res) => {
    const { name, category} = req.body; // `category` is the ID of the parent category
    const userId = req.userId; // Get user ID from userAuth middleware

    if (!name || !category || !userId) {
        return res.status(400).json({ success: false, message: "Name and parent category ID are required." });
    }

    try {
        const newSubCategory = new subCategoryModel({ 
            name,
            category,
            user: userId,
         });
        await newSubCategory.save();

        res.status(201).json({
            success: true,
            message: "Sub-category created successfully.",
            subCategory: newSubCategory,
        });

    } catch (error) {
        console.error("Error creating sub-category:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 2. Get All SubCategories for a specific Category ---
export const getSubCategoriesForCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const subCategories = await subCategoryModel.find({ category: categoryId });
        res.status(200).json({
            success: true,
            subCategories: subCategories,
        });

    } catch (error) {
        console.error("Error fetching sub-categories:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 3. Get a Single SubCategory by ID ---
export const getSubCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const subCategory = await subCategoryModel.findById(id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        res.status(200).json({ success: true, subCategory });
    } catch (error) {
        console.error("Error fetching sub-category:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 4. Update SubCategory ---
export const updateSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const { name } = req.body;
    try {
        await subCategoryModel.findByIdAndUpdate(subCategoryId, { name });
        res.json({ success: true, message: "Sub-Category Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 5. Delete SubCategory and its Products ---
export const deleteSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    try {
        // 1. Delete all Products in this SubCategory
        await productModel.deleteMany({ subCategory: subCategoryId });

        // 2. Delete the SubCategory
        await subCategoryModel.findByIdAndDelete(subCategoryId);

        res.json({ success: true, message: "Sub-Category deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};