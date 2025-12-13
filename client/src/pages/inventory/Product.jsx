import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { Loader2, Plus, Save, Search, Package } from "lucide-react";
import Navbar from "../../components/layout/Navbar.jsx";
import AddProductModal from "../../components/modals/AddProductModal.jsx";

const Product = () => {
  const { subCategoryId } = useParams();
  const { navigate, list, setList, axios } = useAppContext();

  const [subCategoryName, setSubCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subRes = await axios.get(`/subcategory/get/${subCategoryId}`);
      setSubCategoryName(subRes.data.subCategory.name);
      const prodRes = await axios.post(
        `/product/get-for-subcategory/${subCategoryId}`
      );
      setProducts(prodRes.data.products);

      const initialQuantities = {};
      prodRes.data.products.forEach((p) => {
        if (list[p._id]) initialQuantities[p._id] = list[p._id].qty;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subCategoryId) fetchData();
  }, [subCategoryId]);

  const handleCreateProduct = async (data) => {
    setIsCreating(true);
    try {
      const res = await axios.post(`/product/create`, {
        ...data,
        subCategory: subCategoryId,
      });
      if (res.data.success) {
        toast.success("Created!");
        setProducts([...products, res.data.product]);
        setIsProductModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = () => {
    setList((prev) => {
      const updated = { ...prev };
      products.forEach((p) => {
        const qty = quantities[p._id] || 0;
        if (qty > 0) updated[p._id] = { qty, subCategory: subCategoryId };
        else delete updated[p._id];
      });
      return updated;
    });
    toast.success("Saved");
    navigate(-1);
  };

  const filtered = useMemo(
    () =>
      !searchTerm
        ? products
        : products.filter((p) =>
            p.label.toLowerCase().includes(searchTerm.toLowerCase())
          ),
    [products, searchTerm]
  );
  const total = useMemo(
    () =>
      products.reduce(
        (acc, p) => acc + p.sellingPrice * (quantities[p._id] || 0),
        0
      ),
    [products, quantities]
  );

  if (loading)
    return (
      <>
        <Navbar title="Loading..." />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primaryColor" size={40} />
        </div>
      </>
    );

  return (
    <div className="pb-48 bg-gray-50 min-h-screen">
      <Navbar title={subCategoryName || "Products"} />
      <div className="sticky top-14 z-20 px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-primaryColor/50 outline-none"
          />
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-100 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
        <div className="col-span-6 pl-1">Item</div>
        <div className="col-span-2 text-center">Rate</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right pr-1">Total</div>
      </div>
      <div className="bg-white">
        {filtered.map((p) => {
          const qty = quantities[p._id] || 0;
          return (
            <div
              key={p._id}
              className={`grid grid-cols-12 gap-2 items-center px-4 py-3.5 border-b border-gray-50 ${
                qty > 0 ? "bg-green-50/30" : ""
              }`}
            >
              <div className="col-span-6 text-sm font-medium text-gray-800 leading-snug">
                {p.label}
              </div>
              <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                ₹{p.sellingPrice}
              </div>
              <div className="col-span-2 flex justify-center">
                <input
                  type="number"
                  inputMode="numeric"
                  value={qty === 0 ? "" : qty}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [p._id]: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className={`w-12 py-1.5 border rounded-lg text-center text-sm font-bold outline-none ${
                    qty > 0
                      ? "border-primaryColor bg-white text-primaryColor"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="0"
                />
              </div>
              <div
                className={`col-span-2 text-sm text-right font-bold ${
                  qty > 0 ? "text-gray-900" : "text-gray-300"
                }`}
              >
                ₹{(p.sellingPrice * qty).toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => setIsProductModalOpen(true)}
        className="fixed bottom-36 right-5 z-30 p-4 bg-primaryColor text-white rounded-full shadow-lg hover:bg-green-700 active:scale-95"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 z-30 px-5 pb-4 pt-2 rounded-t-2xl">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-gray-500 mb-1">
            Total Amount
          </span>
          <span className="text-2xl font-black text-primaryColor">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-secondaryColor hover:bg-amber-600 active:scale-[0.98]"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleCreateProduct}
        isCreating={isCreating}
      />
    </div>
  );
};

export default Product;
