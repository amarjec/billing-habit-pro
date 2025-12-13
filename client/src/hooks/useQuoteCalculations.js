export const useQuoteCalculations = () => {
    
    const calculateGrandTotal = (items, extraFare, discount) => {
        const itemsTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
        const fareVal = parseFloat(extraFare) || 0;
        const discVal = parseFloat(discount) || 0;
        return (itemsTotal + fareVal) - discVal;
    };

    return { calculateGrandTotal };
};