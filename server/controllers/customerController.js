import customerModel from "../models/customerModel.js";

// 1. Create Customer
export const createCustomer = async (req, res) => {
    const { name, address, number } = req.body;
    const userId = req.userId; 

    if (!name ) {
        return res.json({ success: false, message: "Name is required." });
    }

    try {
        const newCustomer = new customerModel({ 
            name, address, number, user: userId
         });
        await newCustomer.save();
        res.json({ success: true, message: "Customer Saved", customer: newCustomer });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. Get My Customers
export const getMyCustomers = async (req, res) => {
    try {
        const userId = req.userId; 
        const customers = await customerModel.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ success: true, customers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};