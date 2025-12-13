import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// --- 1. Create a New Product (Updated) ---
export const createProduct = async (req, res) => {
    // Added wholesalePrice to destructuring
    const { label, unit, type, sellingPrice, wholesalePrice, costPrice, subCategory } = req.body; 
    
    const userId = req.userId;

    if (!label || !subCategory) {
        return res.status(400).json({ success: false, message: "Label and sub-category are required." });
    }
    
    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    try {
        const newProduct = new productModel({
            label,
            unit: unit || 'pcs',
            type: type || 'number',
            sellingPrice: sellingPrice || 0,
            wholesalePrice: wholesalePrice || sellingPrice, // Save Wholesale Price
            costPrice: costPrice || sellingPrice, 
            subCategory,
            user: userId,
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product: newProduct, 
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 2. Get All Products (Unchanged) ---
export const getProductsForSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    try {
        const products = await productModel.find({ 
            subCategory: subCategoryId,
            user: userId 
        });

        res.status(200).json({
            success: true,
            products: products,
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 3. Get Details for Final Quotation (Updated) ---
export const getProductsForList = async (req, res) => {
    const { productIds } = req.body; 

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ success: false, message: "Product IDs are required." });
    }

    try {
        // --- FIX: Include 'wholesalePrice' in selection ---
        const products = await productModel.find({
            '_id': { $in: productIds }
        }).select('label sellingPrice wholesalePrice unit'); 

        res.status(200).json({
            success: true,
            products: products,
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 4. Get Details for Profit Calculation (Updated) ---
export const getProfitDetailsForList = async (req, res) => {
    const { productIds } = req.body;
    const userId = req.userId;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ success: false, message: "Product IDs are required." });
    }

    try {
        const products = await productModel.find({
            '_id': { $in: productIds },
            'user': userId 
        }).select('label sellingPrice wholesalePrice costPrice'); // Added wholesalePrice just in case

        res.status(200).json({
            success: true,
            products: products,
        });

    } catch (error) {
        console.error("Error fetching product profit details:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// --- 5. Get My Products (FIXED) ---
export const getMyProducts = async (req, res) => {
    const userId = req.userId;
    try {
        const products = await productModel.find({ user: userId })
            .populate({
                path: 'subCategory',
                populate: {
                    path: 'category', // <--- CHANGED from 'categoryId' to 'category'
                    select: 'name'
                },
                select: 'name category' // Select the field we just populated
            })
            .sort({ label: 1 }); 

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getMyProducts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 6. Update Product (Updated) ---

export const updateProduct = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        // 1. Get 'unit' from body
        const { label, costPrice, sellingPrice, wholesalePrice, unit } = req.body;

        if (!label || costPrice === undefined || sellingPrice === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Not found" });
        if (product.user.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });

        // 2. Update fields
        product.label = label;
        product.costPrice = parseFloat(costPrice);
        product.sellingPrice = parseFloat(sellingPrice);
        product.wholesalePrice = parseFloat(wholesalePrice) || 0;
        if(unit) product.unit = unit; // Update Unit

        await product.save();

        res.status(200).json({ success: true, message: "Updated", product });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- 7. Delete Product ---
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID." });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        if (product.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }

        await productModel.deleteOne({ _id: productId });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });

    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};