import quoteModel from '../models/quoteModel.js';
import productModel from '../models/productModel.js';
import customerModel from '../models/customerModel.js';


// 1. Create Quote (Updated)
export const createQuote = async (req, res) => {
    // Added quoteType to destructuring
    const { customerId, itemsList, extraFare, discount, quoteType } = req.body; 
    const userId = req.userId;

    if (!customerId || !itemsList) return res.json({ success: false, message: "Invalid data" });

    try {
        const customer = await customerModel.findOne({ _id: customerId, user: userId });
        if (!customer) return res.json({ success: false, message: "Customer not found." });

        const productIds = Object.keys(itemsList);
        const products = await productModel.find({ '_id': { $in: productIds } }).select('label sellingPrice unit');

        let productsTotal = 0;
        const quoteItems = [];

        for (const product of products) {
            const itemData = itemsList[product._id];
            const qty = itemData.qty;
            const finalSellingPrice = Number(itemData.price);

            if (qty > 0) {
                quoteItems.push({
                    product: product._id,
                    productLabel: product.label,
                    sellingPrice: finalSellingPrice,
                    quantity: qty,
                    unit: product.unit || 'pcs' // Save the unit
                });
                productsTotal += finalSellingPrice * qty;
            }
        }

        const grandTotal = (productsTotal + (Number(extraFare)||0)) - (Number(discount)||0);

        const newQuote = new quoteModel({
            user: userId,
            customer: customerId,
            items: quoteItems,
            totalAmount: grandTotal,
            extraFare: extraFare,
            discount: discount,
            status: 'Pending',
            // --- SAVE TYPE ---
            quoteType: quoteType || 'Retail' 
        });

        await newQuote.save();
        res.json({ success: true, message: "Bill Saved!", quote: newQuote });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 2. Update Quote (Updated)
export const updateQuote = async (req, res) => {
    const { quoteId } = req.params;
    // Added quoteType
    const { itemsList, extraFare, discount, quoteType } = req.body;
    const userId = req.userId;

    try {
        const quote = await quoteModel.findOne({ _id: quoteId, user: userId });
        if (!quote) return res.json({ success: false, message: "Quote not found." });

        const productIds = Object.keys(itemsList);
        const products = await productModel.find({ '_id': { $in: productIds } }).select('label');

        let productsTotal = 0;
        const newItems = [];

        for (const product of products) {
            const itemData = itemsList[product._id];
            const qty = Number(itemData.qty);
            const finalPrice = Number(itemData.price);

            if (qty > 0) {
                newItems.push({
                    product: product._id,
                    productLabel: product.label,
                    sellingPrice: finalPrice,
                    quantity: qty,
                });
                productsTotal += finalPrice * qty;
            }
        }

        quote.items = newItems;
        quote.totalAmount = (productsTotal + (Number(extraFare)||0)) - (Number(discount)||0);
        quote.extraFare = extraFare;
        quote.discount = discount;
        // --- UPDATE TYPE ---
        if(quoteType) quote.quoteType = quoteType;

        await quote.save();
        res.json({ success: true, message: "Quote Updated!", quote });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 3. Update Quote Status
export const updateQuoteStatus = async (req, res) => {
    const { quoteId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    try {
        const quote = await quoteModel.findOneAndUpdate(
            { _id: quoteId, user: userId },
            { status: status },
            { new: true }
        );

        if (!quote) return res.json({ success: false, message: "Quote not found." });
        res.json({ success: true, message: "Status Updated", status: quote.status });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 4. Get All Quotes
export const getMyQuotes = async (req, res) => {
    try {
        const userId = req.userId;
        const quotes = await quoteModel.find({ user: userId })
            .populate('customer', 'name number')
            .sort({ createdAt: -1 });
        res.json({ success: true, quotes });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 5. Get Single Quote
export const getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const quote = await quoteModel.findOne({ _id: id, user: userId })
            .populate('customer', 'name number address');
        if (!quote) return res.json({ success: false, message: "Not found" });
        res.json({ success: true, quote });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};