// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext.jsx';
// import toast from 'react-hot-toast';
// import { Loader2, Plus, Save, Search, Package, Minus } from 'lucide-react';
// import Navbar from '../../components/layout/Navbar.jsx'; 
// import AddProductModal from '../../components/modals/AddProductModal.jsx';

// const Product = () => {
//     const { subCategoryId } = useParams();
//     const { navigate, list, setList, axios } = useAppContext();

//     const [subCategoryName, setSubCategoryName] = useState('');
//     const [products, setProducts] = useState([]);
//     const [quantities, setQuantities] = useState({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//     const [isCreating, setIsCreating] = useState(false);
//     const [loading, setLoading] = useState(true);

//     // --- Theme Accents ---
//     const primaryAccentBg = 'bg-slate-900';
//     const primaryAccentText = 'text-slate-900';
//     const primaryAccentRing = 'focus:ring-slate-900/30';

//     const fetchData = async () => {
//         try {
//             const subRes = await axios.get(`/subcategory/get/${subCategoryId}`);
//             setSubCategoryName(subRes.data.subCategory.name);
//             const prodRes = await axios.post(`/product/get-for-subcategory/${subCategoryId}`);
//             setProducts(prodRes.data.products);

//             const initialQuantities = {};
//             prodRes.data.products.forEach(p => {
//                 if (list[p._id]) initialQuantities[p._id] = list[p._id].qty;
//             });
//             setQuantities(initialQuantities);
//         } catch (error) { toast.error("Failed to fetch data"); } 
//         finally { setLoading(false); }
//     };

//     useEffect(() => {
//         if (subCategoryId) fetchData();
//     }, [subCategoryId]);

//     const handleCreateProduct = async (data) => {
//         setIsCreating(true);
//         try {
//             const res = await axios.post(`/product/create`, { ...data, subCategory: subCategoryId });
//             if (res.data.success) {
//                 toast.success("Product Created!");
//                 setProducts([...products, res.data.product]);
//                 setIsProductModalOpen(false);
//             }
//         } catch (error) { toast.error("Failed to create product"); } 
//         finally { setIsCreating(false); }
//     };

//     const handleSave = () => {
//         setList(prev => {
//             const updated = { ...prev };
//             products.forEach(p => {
//                 const qty = quantities[p._id] || 0;
//                 if (qty > 0) updated[p._id] = { qty, subCategory: subCategoryId };
//                 else delete updated[p._id];
//             });
//             return updated;
//         });
//         toast.success("Cart Updated");
//         navigate(-1);
//     };

//     // --- Quantity Handlers ---
//     const handleIncrement = (id) => {
//         setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
//     };

//     const handleDecrement = (id) => {
//         setQuantities(prev => {
//             const current = prev[id] || 0;
//             return { ...prev, [id]: Math.max(0, current - 1) };
//         });
//     };

//     const handleManualInput = (id, value) => {
//         const num = value === '' ? 0 : parseInt(value);
//         if (!isNaN(num) && num >= 0) {
//             setQuantities(prev => ({ ...prev, [id]: num }));
//         }
//     };

//     const filtered = useMemo(() => !searchTerm ? products : products.filter(p => p.label.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);
//     const total = useMemo(() => products.reduce((acc, p) => acc + (p.sellingPrice * (quantities[p._id] || 0)), 0), [products, quantities]);

//     // --- Skeleton Loader ---
//     const ProductListSkeleton = () => (
//         <div className="bg-white">
//              {[1, 2, 3, 4, 5, 6].map(i => (
//                 <div key={i} className="grid grid-cols-12 gap-2 items-center px-4 py-4 border-b border-gray-50 animate-pulse">
//                     <div className="col-span-6 h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="col-span-2 h-4 bg-gray-200 rounded mx-auto w-10"></div>
//                     <div className="col-span-2 h-8 bg-gray-100 rounded w-12 mx-auto"></div>
//                     <div className="col-span-2 h-4 bg-gray-200 rounded ml-auto w-8"></div>
//                 </div>
//              ))}
//         </div>
//     );

//     return (
//         <div className='pb-48 bg-gray-50 min-h-screen'>
//             <Navbar title={subCategoryName || "Loading..."} />
            
//             {/* Sticky Search & Info Bar */}
//             <div className="sticky top-14 z-20 bg-white shadow-sm border-b border-gray-100">
//                 <div className="px-4 py-3 bg-gray-50/50 backdrop-blur-md border-b border-gray-200/50">
//                     <div className="relative">
//                         <input 
//                             type="text" 
//                             placeholder="Search products..." 
//                             value={searchTerm} 
//                             onChange={(e) => setSearchTerm(e.target.value)} 
//                             className={`w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${primaryAccentRing} transition-all`} 
//                         />
//                         <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
//                     <div className="col-span-5 text-left pl-1">Item Details</div>
//                     <div className="col-span-2">Rate</div>
//                     <div className="col-span-3">Qty</div>
//                     <div className="col-span-2 text-right pr-1">Amt</div>
//                 </div>
//             </div>

//             {/* Product List Content */}
//             {loading ? (
//                 <ProductListSkeleton />
//             ) : (
//                 <div className="bg-white min-h-[300px]">
//                     {filtered.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//                             <Package size={48} className="opacity-20 mb-2"/>
//                             <p className="text-sm font-medium">No products found here.</p>
//                         </div>
//                     ) : (
//                         filtered.map(p => {
//                             const qty = quantities[p._id] || 0;
//                             const isSelected = qty > 0;
//                             return (
//                                 <div key={p._id} className={`grid grid-cols-12 gap-1 items-center px-3 py-3 border-b border-gray-50 transition-all duration-200 ${isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                                    
//                                     {/* Name (5 Cols) */}
//                                     <div className="col-span-5 pr-1">
//                                         <div className={`text-sm font-bold leading-snug truncate ${isSelected ? 'text-slate-900' : 'text-gray-700'}`}>{p.label}</div>
//                                         <div className="text-[10px] text-gray-400 mt-0.5 font-medium">Per {p.unit || 'pcs'}</div>
//                                     </div>
                                    
//                                     {/* Rate (2 Cols) */}
//                                     <div className="col-span-2 text-center text-xs font-semibold text-gray-500">
//                                         ₹{p.sellingPrice}
//                                     </div>
                                    
//                                     {/* Qty Controls (3 Cols) - WITH INPUT */}
//                                     <div className="col-span-3 flex items-center justify-center gap-1">
                                        
//                                         {/* Minus Button */}
//                                         <button 
//                                             onClick={() => handleDecrement(p._id)}
//                                             disabled={qty === 0}
//                                             className={`w-7 h-7 flex items-center justify-center rounded-lg border shadow-sm transition-all active:scale-90 
//                                                 ${qty > 0 
//                                                     ? 'bg-white border-gray-200 text-slate-700 hover:border-gray-300' 
//                                                     : 'bg-gray-50 border-transparent text-gray-300 pointer-events-none'}`}
//                                         >
//                                             <Minus size={14} strokeWidth={2.5} />
//                                         </button>

//                                         {/* MANUAL INPUT FIELD */}
//                                         <input 
//                                             type="number" 
//                                             inputMode="numeric"
//                                             value={qty === 0 ? '' : qty}
//                                             onChange={(e) => handleManualInput(p._id, e.target.value)}
//                                             placeholder="0"
//                                             className={`w-8 h-7 text-center text-sm font-bold bg-transparent outline-none border-b-2 transition-colors
//                                                 ${isSelected 
//                                                     ? 'text-slate-900 border-slate-900 focus:border-blue-600' 
//                                                     : 'text-gray-400 border-transparent focus:border-gray-300'}`}
//                                         />

//                                         {/* Plus Button */}
//                                         <button 
//                                             onClick={() => handleIncrement(p._id)}
//                                             className={`w-7 h-7 flex items-center justify-center rounded-lg shadow-sm transition-all active:scale-90
//                                                 ${isSelected 
//                                                     ? 'bg-slate-900 text-white shadow-slate-900/20' 
//                                                     : 'bg-white border border-slate-900 text-slate-900'}`}
//                                         >
//                                             <Plus size={14} strokeWidth={2.5} />
//                                         </button>
//                                     </div>
                                    
//                                     {/* Total Amount (2 Cols) */}
//                                     <div className={`col-span-2 text-sm text-right font-black pr-1 ${isSelected ? 'text-slate-900' : 'text-gray-200'}`}>
//                                         ₹{(p.sellingPrice * qty).toFixed(0)}
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             )}

//             {/* Floating Add Button */}
//             <button 
//                 onClick={() => setIsProductModalOpen(true)} 
//                 className={`fixed bottom-40 right-5 z-30 p-4 ${primaryAccentBg} text-white rounded-full shadow-xl shadow-slate-900/30 hover:scale-110 transition-transform active:scale-95`}
//             >
//                 <Plus size={26} strokeWidth={2.5} />
//             </button>

//             {/* Bottom Total Bar */}
//             <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl safe-area-pb">
//                 <div className="flex justify-between items-end mb-4 px-1">
//                     <span className="text-sm font-bold text-gray-500 mb-1">Total Amount</span>
//                     <span className={`text-3xl font-black ${primaryAccentText} tracking-tight`}>₹{total.toLocaleString('en-IN')}</span>
//                 </div>
//                 <button 
//                     onClick={handleSave} 
//                     className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all`}
//                 >
//                     <Save size={20} /> Save Changes
//                 </button>
//             </div>

//             <AddProductModal 
//                 isOpen={isProductModalOpen} 
//                 onClose={() => setIsProductModalOpen(false)} 
//                 onSubmit={handleCreateProduct} 
//                 isCreating={isCreating} 
//             />
//         </div>
//     );
// };

// export default Product;

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, Plus, Save, Search, Package, Minus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx'; 
import AddProductModal from '../../components/modals/AddProductModal.jsx';

const Product = () => {
    // subCategoryId will be "all" when clicking your new button
    const { subCategoryId } = useParams();
    const { navigate, list, setList, axios } = useAppContext();

    const [subCategoryName, setSubCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentText = 'text-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';

    const fetchData = async () => {
        setLoading(true);
        try {
            let fetchedProducts = [];

            // --- FIX: Check if we are in "All Products" mode ---
            if (subCategoryId === 'all') {
                setSubCategoryName("All Products");
                
                // Call the endpoint that gets EVERYTHING (paginated, so we ask for a high limit)
                // Ensure your backend 'getMyProducts' supports the limit param
                const prodRes = await axios.get(`/product/my-products?limit=1000`);
                if (prodRes.data.success) {
                    fetchedProducts = prodRes.data.products;
                }
            } else {
                // --- Normal Mode: Specific SubCategory ---
                const subRes = await axios.get(`/subcategory/get/${subCategoryId}`);
                setSubCategoryName(subRes.data.subCategory.name);
                
                const prodRes = await axios.post(`/product/get-for-subcategory/${subCategoryId}`);
                if (prodRes.data.success) {
                    fetchedProducts = prodRes.data.products;
                }
            }

            setProducts(fetchedProducts);

            // Restore Cart Quantities
            const initialQuantities = {};
            fetchedProducts.forEach(p => {
                if (list[p._id]) initialQuantities[p._id] = list[p._id].qty;
            });
            setQuantities(initialQuantities);

        } catch (error) { 
            console.error(error);
            toast.error("Failed to fetch data"); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (subCategoryId) fetchData();
    }, [subCategoryId]);

    const handleCreateProduct = async (data) => {
        // Prevent creating items in "All" view if no subCategory is pre-selected
        // Or you can force user to select one in the modal.
        if (subCategoryId === 'all' && !data.subCategory) {
            return toast.error("Please select a sub-category inside the modal");
        }

        setIsCreating(true);
        try {
            // If in "All" mode, the modal must provide the subCategory ID
            const payload = { 
                ...data, 
                subCategory: subCategoryId === 'all' ? data.subCategory : subCategoryId 
            };
            
            const res = await axios.post(`/product/create`, payload);
            if (res.data.success) {
                toast.success("Product Created!");
                setProducts([...products, res.data.product]);
                setIsProductModalOpen(false);
            }
        } catch (error) { toast.error("Failed to create product"); } 
        finally { setIsCreating(false); }
    };

    const handleSave = () => {
        setList(prev => {
            const updated = { ...prev };
            products.forEach(p => {
                const qty = quantities[p._id] || 0;
                // Save with the product's actual subCategory, not just the URL param
                // (Important for 'all' mode so cart knows where it came from)
                if (qty > 0) {
                    updated[p._id] = { 
                        qty, 
                        subCategory: p.subCategory?._id || p.subCategory || subCategoryId 
                    };
                } else {
                    delete updated[p._id];
                }
            });
            return updated;
        });
        toast.success("Cart Updated");
        navigate(-1);
    };

    // --- Quantity Handlers ---
    const handleIncrement = (id) => {
        setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDecrement = (id) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            return { ...prev, [id]: Math.max(0, current - 1) };
        });
    };

    const handleManualInput = (id, value) => {
        const num = value === '' ? 0 : parseInt(value);
        if (!isNaN(num) && num >= 0) {
            setQuantities(prev => ({ ...prev, [id]: num }));
        }
    };

    const filtered = useMemo(() => !searchTerm ? products : products.filter(p => p.label.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);
    const total = useMemo(() => products.reduce((acc, p) => acc + (p.sellingPrice * (quantities[p._id] || 0)), 0), [products, quantities]);

    // --- Skeleton Loader ---
    const ProductListSkeleton = () => (
        <div className="bg-white">
             {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center px-4 py-4 border-b border-gray-50 animate-pulse">
                    <div className="col-span-6 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="col-span-2 h-4 bg-gray-200 rounded mx-auto w-10"></div>
                    <div className="col-span-2 h-8 bg-gray-100 rounded w-12 mx-auto"></div>
                    <div className="col-span-2 h-4 bg-gray-200 rounded ml-auto w-8"></div>
                </div>
             ))}
        </div>
    );

    return (
        <div className='pb-48 bg-gray-50 min-h-screen'>
            <Navbar title={subCategoryName || "Loading..."} />
            
            {/* Sticky Search & Info Bar */}
            <div className="sticky top-14 z-20 bg-white shadow-sm border-b border-gray-100">
                <div className="px-4 py-3 bg-gray-50/50 backdrop-blur-md border-b border-gray-200/50">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className={`w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${primaryAccentRing} transition-all`} 
                        />
                        <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    <div className="col-span-5 text-left pl-1">Item Details</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-3">Qty</div>
                    <div className="col-span-2 text-right pr-1">Amt</div>
                </div>
            </div>

            {/* Product List Content */}
            {loading ? (
                <ProductListSkeleton />
            ) : (
                <div className="bg-white min-h-[300px]">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Package size={48} className="opacity-20 mb-2"/>
                            <p className="text-sm font-medium">No products found here.</p>
                        </div>
                    ) : (
                        filtered.map(p => {
                            const qty = quantities[p._id] || 0;
                            const isSelected = qty > 0;
                            return (
                                <div key={p._id} className={`grid grid-cols-12 gap-1 items-center px-3 py-3 border-b border-gray-50 transition-all duration-200 ${isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                                    
                                    {/* Name (5 Cols) */}
                                    <div className="col-span-5 pr-1">
                                        <div className={`text-sm font-bold leading-snug truncate ${isSelected ? 'text-slate-900' : 'text-gray-700'}`}>{p.label}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5 font-medium">Per {p.unit || 'pcs'}</div>
                                    </div>
                                    
                                    {/* Rate (2 Cols) */}
                                    <div className="col-span-2 text-center text-xs font-semibold text-gray-500">
                                        ₹{p.sellingPrice}
                                    </div>
                                    
                                    {/* Qty Controls (3 Cols) */}
                                    <div className="col-span-3 flex items-center justify-center gap-1">
                                        <button 
                                            onClick={() => handleDecrement(p._id)}
                                            disabled={qty === 0}
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg border shadow-sm transition-all active:scale-90 
                                                ${qty > 0 
                                                    ? 'bg-white border-gray-200 text-slate-700 hover:border-gray-300' 
                                                    : 'bg-gray-50 border-transparent text-gray-300 pointer-events-none'}`}
                                        >
                                            <Minus size={14} strokeWidth={2.5} />
                                        </button>

                                        <input 
                                            type="number" 
                                            inputMode="numeric"
                                            value={qty === 0 ? '' : qty}
                                            onChange={(e) => handleManualInput(p._id, e.target.value)}
                                            placeholder="0"
                                            className={`w-8 h-7 text-center text-sm font-bold bg-transparent outline-none border-b-2 transition-colors
                                                ${isSelected 
                                                    ? 'text-slate-900 border-slate-900 focus:border-blue-600' 
                                                    : 'text-gray-400 border-transparent focus:border-gray-300'}`}
                                        />

                                        <button 
                                            onClick={() => handleIncrement(p._id)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg shadow-sm transition-all active:scale-90
                                                ${isSelected 
                                                    ? 'bg-slate-900 text-white shadow-slate-900/20' 
                                                    : 'bg-white border border-blue-200 text-blue-600'}`}
                                        >
                                            <Plus size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                    
                                    {/* Total Amount (2 Cols) */}
                                    <div className={`col-span-2 text-sm text-right font-black pr-1 ${isSelected ? 'text-slate-900' : 'text-gray-200'}`}>
                                        ₹{(p.sellingPrice * qty).toFixed(0)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Floating Add Button */}
            <button 
                onClick={() => setIsProductModalOpen(true)} 
                className={`fixed bottom-40 right-5 z-30 p-4 ${primaryAccentBg} text-white rounded-full shadow-xl shadow-slate-900/30 hover:scale-110 transition-transform active:scale-95`}
            >
                <Plus size={26} strokeWidth={2.5} />
            </button>

            {/* Bottom Total Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl safe-area-pb">
                <div className="flex justify-between items-end mb-4 px-1">
                    <span className="text-sm font-bold text-gray-500 mb-1">Total Amount</span>
                    <span className={`text-3xl font-black ${primaryAccentText} tracking-tight`}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <button 
                    onClick={handleSave} 
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all`}
                >
                    <Save size={20} /> Save Changes
                </button>
            </div>

            <AddProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => setIsProductModalOpen(false)} 
                onSubmit={handleCreateProduct} 
                isCreating={isCreating}
                // Optional: You might want to pass a prop to the modal telling it to show a subCategory dropdown 
                // if we are in 'all' mode, since the user hasn't selected one yet.
                forceSubCategorySelection={subCategoryId === 'all'} 
            />
        </div>
    );
};

export default Product;