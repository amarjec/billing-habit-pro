import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx"; // Updated Path
import toast from "react-hot-toast";
import { Loader2, User, Phone, MapPin, EyeOff, Download, Briefcase } from "lucide-react";
import Navbar from "../../components/layout/Navbar.jsx";
import ProfitModal from "../../components/modals/ProfitModal.jsx";
import QuoteItemRow from "../../components/quote/QuoteItemRow.jsx";
import QuoteSummary from "../../components/quote/QuoteSummary.jsx";
import { generatePDF } from "../../utils/generatePDF.js";

const FinalQuotation = () => {
  const { list, selectedCustomer, navigate, axios } = useAppContext();

  // --- State ---
  const [quoteItems, setQuoteItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Bill Settings
  const [extraFare, setExtraFare] = useState("");
  const [discount, setDiscount] = useState("");
  const [isWholesale, setIsWholesale] = useState(false);

  // UI State
  const [editingId, setEditingId] = useState(null);
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

  // --- Data Loading ---
  useEffect(() => {
    if (isCreating) return;
    if (!selectedCustomer) { toast.error("No customer selected."); navigate("/customer"); return; }
    if (Object.keys(list).length === 0) { toast.error("List empty."); navigate("/"); return; }

    const fetchQuoteDetails = async () => {
      setLoading(true);
      try {
        const productIds = Object.keys(list);
        const res = await axios.post("/product/get-details-for-list", { productIds });
        if (!res.data.success) throw new Error("API Error");

        let calculatedTotal = 0;
        const items = res.data.products.map((product) => {
            const listItem = list[product._id];
            if (!listItem) return null;

            const quantity = Number(listItem.qty);
            const retailPrice = Number(product.sellingPrice) || 0;
            const wsPrice = Number(product.wholesalePrice) || 0;
            // Fallback: If wholesale is 0, use retail
            const wholesalePrice = wsPrice > 0 ? wsPrice : retailPrice;

            const activePrice = retailPrice; 
            calculatedTotal += activePrice * quantity;

            return {
              _id: product._id,
              label: product.label,
              unit: product.unit || "pcs",
              retailPrice,
              wholesalePrice,
              sellingPrice: activePrice,
              quantity,
              total: activePrice * quantity,
            };
          }).filter(Boolean);

        setQuoteItems(items);
        setTotal(calculatedTotal);
      } catch (error) {
        toast.error("Failed to load items");
        navigate(-1);
      } finally { setLoading(false); }
    };
    fetchQuoteDetails();
  }, [list, selectedCustomer, navigate, isCreating, axios]);

  // --- Logic Helpers ---
  const recalculateTotal = (items) => {
      return items.reduce((sum, item) => sum + item.total, 0);
  };

  // --- Handlers ---
  const toggleWholesaleMode = () => {
    const newMode = !isWholesale;
    setIsWholesale(newMode);
    setQuoteItems((prev) => {
        const updated = prev.map((item) => {
            const newPrice = newMode ? item.wholesalePrice : item.retailPrice;
            return { ...item, sellingPrice: newPrice, total: newPrice * item.quantity };
        });
        setTotal(recalculateTotal(updated));
        return updated;
    });
    toast.success(newMode ? "Wholesale Prices Applied" : "Retail Prices Applied");
  };

  const handleUpdateItem = (id, field, value) => {
    const numValue = parseFloat(value) || 0;
    setQuoteItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id === id) {
          const newItem = { ...item, [field]: numValue };
          newItem.total = newItem.sellingPrice * newItem.quantity;
          return newItem;
        }
        return item;
      });
      setTotal(recalculateTotal(updated));
      return updated;
    });
  };

  const handleSaveQuote = async () => {
    setEditingId(null);
    setIsCreating(true);
    try {
      const itemsList = {};
      quoteItems.forEach(item => {
        itemsList[item._id] = { qty: item.quantity, price: item.sellingPrice, unit: item.unit };
      });

      const res = await axios.post("/quote/create", {
        customerId: selectedCustomer._id,
        itemsList,
        extraFare: parseFloat(extraFare) || 0,
        discount: parseFloat(discount) || 0,
        quoteType: isWholesale ? "Wholesale" : "Retail",
      });

      if (res.data.success) {
        toast.success("Saved Successfully!");
        navigate("/history");
      }
    } catch (error) { toast.error("Failed to save quote"); } 
    finally { setIsCreating(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primaryColor" size={40} /></div>;

  return (
    <div className="pb-64 bg-gray-50 min-h-screen">
      <Navbar title="Review Quotation" />

      {/* Actions */}
      <div className="absolute top-0 right-0 z-60 h-14 flex items-center pr-2 gap-1 no-print">
        <button onClick={() => setIsProfitModalOpen(true)} className="p-2 text-white/90 hover:bg-white/10 rounded-full"><EyeOff size={22} /></button>
        <button onClick={() => { setEditingId(null); generatePDF("invoice-content", `Quote_${selectedCustomer.name}`); }} className="p-2 text-white/90 hover:bg-white/10 rounded-full"><Download size={22} /></button>
      </div>

      <div id="invoice-content" className="bg-white min-h-screen">
        
        {/* Header Information */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm mb-2 relative">
          <div className="absolute top-4 right-4 z-10 no-print">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isWholesale} onChange={toggleWholesaleMode} className="sr-only peer" />
              <div className="relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              <span className="ms-2 text-xs font-bold text-gray-600 flex items-center gap-1">{isWholesale ? <Briefcase size={12} className="text-purple-600" /> : null} Wholesale</span>
            </label>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 mt-1 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><User className="text-primaryColor" size={20} /></div>
            <div className="flex-1 min-w-0 pr-24">
              <h3 className="text-lg font-bold text-gray-800 leading-tight">{selectedCustomer.name}</h3>
              <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
                {selectedCustomer.number && <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedCustomer.number}</span>}
                {selectedCustomer.address && <span className="flex items-start gap-1.5 leading-snug"><MapPin size={14} className="mt-0.5" /> <span>{selectedCustomer.address}</span></span>}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-gray-100 border-y border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-2 px-3 py-2 shadow-sm">
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-3 text-right">Total</div>
        </div>

        <div className="bg-white divide-y divide-gray-100">
          {quoteItems.map((item) => (
            <QuoteItemRow
                key={item._id}
                item={item}
                isEditing={editingId === item._id}
                onEditClick={setEditingId}
                onUpdate={handleUpdateItem}
                isWholesaleMode={isWholesale}
            />
          ))}
        </div>

        {/* Summary */}
        <QuoteSummary 
            total={total}
            extraFare={extraFare}
            discount={discount}
            onFareChange={setExtraFare}
            onDiscountChange={setDiscount}
        />
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t-2 z-10 p-4 safe-area-pb">
        <div className="max-w-md mx-auto">
          <button onClick={handleSaveQuote} disabled={isCreating} className="no-print w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-primaryColor hover:bg-green-700 disabled:bg-gray-300">
            {isCreating ? <Loader2 className="animate-spin" size={22} /> : "Save & Finalize"}
          </button>
        </div>
      </div>

      <ProfitModal isOpen={isProfitModalOpen} onClose={() => setIsProfitModalOpen(false)} items={quoteItems} extraFare={extraFare} discount={discount} />
    </div>
  );
};

export default FinalQuotation;