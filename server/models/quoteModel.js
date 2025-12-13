import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    productLabel: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'pcs' }
}, { _id: false });

const quoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer', required: true },
    items: [quoteItemSchema],
    totalAmount: { type: Number, required: true },
    extraFare: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    // --- NEW FIELD ---
    quoteType: {
        type: String,
        enum: ['Retail', 'Wholesale'],
        default: 'Retail'
    }
}, { timestamps: true });

const quoteModel = mongoose.model('Quote', quoteSchema);
export default quoteModel;