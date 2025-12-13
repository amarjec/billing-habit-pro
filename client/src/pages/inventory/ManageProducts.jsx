import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, Search, Edit2, Trash2, X, Save, ChevronRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';

const ManageProducts = () => {
    const { axios } = useAppContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCat, setSelectedSubCat] = useState('All');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('/product/my-products');
                if (res.data.success) setProducts(res.data.products);
            } catch (error) { toast.error("Failed to load products"); } 
            finally { setLoading(false); }
        };
        fetch();
    }, [axios]);

    const categories = useMemo(() => {
        const unique = new Map();
        products.forEach(p => { if (p.subCategory?.category?._id) unique.set(p.subCategory.category._id, p.subCategory.category); });
        return Array.from(unique.values());
    }, [products]);

    const subCategories = useMemo(() => {
        if (selectedCategory === 'All') return [];
        const unique = new Map();
        products.forEach(p => { if (p.subCategory?.category?._id === selectedCategory) unique.set(p.subCategory._id, p.subCategory); });
        return Array.from(unique.values());
    }, [products, selectedCategory]);

    const filtered = products.filter(p => {
        const matchSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory === 'All' || p.subCategory?.category?._id === selectedCategory;
        const matchSub = selectedSubCat === 'All' || p.subCategory?._id === selectedSubCat;
        return matchSearch && matchCat && matchSub;
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put(`/product/update/${editingProduct._id}`, editingProduct);
            if (res.data.success) {
                toast.success("Updated");
                setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...res.data.product } : p));
                setEditingProduct(null);
            }
        } catch (error) { toast.error("Failed"); } finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        if(!confirm("Delete?")) return;
        try {
            const res = await axios.delete(`/product/delete/${id}`);
            if(res.data.success) { toast.success("Deleted"); setProducts(prev => prev.filter(p => p._id !== id)); }
        } catch(e) { toast.error("Failed"); }
    };

    if (loading) return <div className='flex justify-center items-center h-64'><Loader2 className="animate-spin text-primaryColor" size={40} /></div>;

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Navbar title="Manage Inventory" />
            <div className="sticky top-14 z-10 bg-gray-50 pt-4 pb-2 space-y-3 shadow-sm border-b border-gray-200">
                <div className="px-4 relative"><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primaryColor" /><Search className="absolute left-7 top-3 text-gray-400" size={20} /></div>
                <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar">
                    <button onClick={() => {setSelectedCategory('All'); setSelectedSubCat('All')}} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${selectedCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>All</button>
                    {categories.map(c => <button key={c._id} onClick={() => setSelectedCategory(c._id)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${selectedCategory === c._id ? 'bg-primaryColor text-white' : 'bg-white text-gray-600'}`}>{c.name}</button>)}
                </div>
                {selectedCategory !== 'All' && subCategories.length > 0 && <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar pb-1"><ChevronRight size={16} className="text-gray-400 mt-1"/><button onClick={() => setSelectedSubCat('All')} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap ${selectedSubCat === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}>All Items</button>{subCategories.map(s => <button key={s._id} onClick={() => setSelectedSubCat(s._id)} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap ${selectedSubCat === s._id ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}>{s.name}</button>)}</div>}
            </div>

            <div className="px-4 py-4 space-y-3">
                {filtered.map(p => (
                    <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start"><div className="flex-1"><h3 className="font-bold text-gray-800 leading-tight">{p.label}</h3><div className="flex items-center gap-1 mt-1"><span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border">{p.subCategory?.name}</span><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Per {p.unit || 'pcs'}</span></div></div></div>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2 rounded-lg border">
                            <div className="flex flex-col"><span className="text-gray-400 font-bold uppercase">Cost</span><span className="font-medium">₹{p.costPrice}</span></div>
                            <div className="flex flex-col border-l pl-2"><span className="text-gray-400 font-bold uppercase">Retail</span><span className="font-bold text-gray-800">₹{p.sellingPrice}</span></div>
                            <div className="flex flex-col border-l pl-2"><span className="text-gray-400 font-bold uppercase">Wholesale</span><span className="font-bold text-purple-600">{p.wholesalePrice || '-'}</span></div>
                        </div>
                        <div className="flex gap-2"><button onClick={() => setEditingProduct({...p, unit: p.unit || 'pcs'})} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex justify-center gap-2"><Edit2 size={16}/> Edit</button><button onClick={() => handleDelete(p._id)} className="w-12 bg-red-50 text-red-600 rounded-lg flex justify-center items-center"><Trash2 size={18}/></button></div>
                    </div>
                ))}
            </div>

            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">Edit Product</h3><button onClick={() => setEditingProduct(null)}><X size={20}/></button></div>
                        <form onSubmit={handleUpdate} className="p-5 space-y-4">
                            <input required className="w-full p-2.5 border rounded-lg" value={editingProduct.label} onChange={e => setEditingProduct({...editingProduct, label: e.target.value})} placeholder="Name" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" className="w-full p-2.5 border rounded-lg" value={editingProduct.costPrice} onChange={e => setEditingProduct({...editingProduct, costPrice: e.target.value})} placeholder="Cost" />
                                <input className="w-full p-2.5 border rounded-lg bg-blue-50" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})} placeholder="Unit" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" className="w-full p-2.5 border rounded-lg" value={editingProduct.sellingPrice} onChange={e => setEditingProduct({...editingProduct, sellingPrice: e.target.value})} placeholder="Retail" />
                                <input type="number" className="w-full p-2.5 border rounded-lg bg-purple-50" value={editingProduct.wholesalePrice} onChange={e => setEditingProduct({...editingProduct, wholesalePrice: e.target.value})} placeholder="Wholesale" />
                            </div>
                            <button disabled={isSaving} className="w-full py-3 bg-primaryColor text-white font-bold rounded-xl flex justify-center">{isSaving ? <Loader2 className="animate-spin"/> : "Update"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;