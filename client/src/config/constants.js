export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const QUOTE_STATUS = {
    PENDING: 'Pending',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

export const QUOTE_TYPES = {
    RETAIL: 'Retail',
    WHOLESALE: 'Wholesale'
};

export const STATUS_COLORS = {
    'Delivered': 'bg-green-100 text-green-700 border-green-200',
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    'Default': 'bg-gray-100 text-gray-700 border-gray-200'
};