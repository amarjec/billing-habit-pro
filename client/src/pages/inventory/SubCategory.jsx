import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { SquarePlus, X, Loader2, Circle, CircleCheckBig, Search, Settings, Edit2, Trash2, Box, AlertTriangle, ChevronRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx'; 
import BottomNav from '../../components/layout/BottomNav.jsx';

const SubCategory = () => {
    const { categoryId } = useParams();
    const { navigate, axios, list } = useAppContext();

    const [categoryName, setCategoryName] = useState(''); 
    const [subCategories, setSubCategories] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isManageMode, setIsManageMode] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    
    const [editingSub, setEditingSub] = useState(null); 
    const [deleteId, setDeleteId] = useState(null); 
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const catRes = await axios.get(`/category/get/${categoryId}`);
                if (catRes.data.success) setCategoryName(catRes.data.category.name);
                const subRes = await axios.get(`/subcategory/get-for-category/${categoryId}`);
                if (subRes.data.success) setSubCategories(subRes.data.subCategories);
            } catch (error) { toast.error("Failed to fetch data"); } 
            finally { setLoading(false); }
        };
        if (categoryId) fetchData();
    }, [categoryId, axios]);

    const filledSubCategoryIds = useMemo(() => new Set(Object.values(list).map(item => item.subCategory)), [list]); 
    const filteredSubCategories = useMemo(() => !searchTerm ? subCategories : subCategories.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), [subCategories, searchTerm]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newSubCategoryName.trim()) return toast.error("Name is required.");
        setIsCreating(true);
        try {
            if (editingSub) {
                const res = await axios.put(`/subcategory/update/${editingSub._id}`, { name: newSubCategoryName });
                if (res.data.success) {
                    toast.success("Updated!");
                    setSubCategories(prev => prev.map(item => item._id === editingSub._id ? { ...item, name: newSubCategoryName } : item));
                }
            } else {
                const res = await axios.post(`/subcategory/create`, { name: newSubCategoryName, category: categoryId });
                if (res.data.success) {
                    toast.success("Created!");
                    setSubCategories([...subCategories, res.data.subCategory]);
                }
            }
            setIsModalOpen(false);
        } catch (error) { toast.error("Operation failed"); } 
        finally { setIsCreating(false); }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsCreating(true); 
        try {
            const res = await axios.delete(`/subcategory/delete/${deleteId}`);
            if(res.data.success) {
                toast.success("Deleted");
                setSubCategories(prev => prev.filter(item => item._id !== deleteId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) { toast.error("Delete failed"); } 
        finally { setIsCreating(false); setDeleteId(null); }
    };

    if (loading) return <><Navbar title="Loading..." /><div className='flex justify-center items-center h-64'><Loader2 className="animate-spin text-primaryColor" size={40} /></div></>;

    return (
        <div className='pb-24 bg-gray-50 min-h-screen'>
            <Navbar title={categoryName || "Sub-Categories"} />
            <div className="sticky top-14 z-10 px-4 pt-4 pb-2 bg-gray-50/95 backdrop-blur-sm">
                <div className="flex gap-2">
                    <div className="relative flex-1 shadow-sm">
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor/50" />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                    <button onClick={() => setIsManageMode(!isManageMode)} className={`p-3 rounded-xl border transition-all ${isManageMode ? 'bg-primaryColor text-white shadow-lg' : 'bg-white text-gray-500'}`}><Settings size={22} /></button>
                </div>
            </div>
            
            <div className='grid grid-cols-2 gap-3 px-4 py-2'>
                {filteredSubCategories.map((row) => {
                    const isFilled = filledSubCategoryIds.has(row._id);
                    return (
                        <div key={row._id} onClick={() => !isManageMode && navigate(`/products/${row._id}`)} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all flex flex-col justify-between h-36 relative overflow-hidden group ${isManageMode ? 'border-primaryColor/30' : 'border-gray-100 active:scale-[0.96] cursor-pointer'}`}>
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                            <div className="relative z-10 flex-1 flex flex-col items-start justify-center">
                                <div className={`p-2.5 rounded-full mb-3 ${isFilled ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-primaryColor'}`}>{isFilled ? <CircleCheckBig size={20} /> : <Box size={20} />}</div>
                                <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 text-[14px]">{row.name}</h3>
                            </div>
                            <div className="relative z-10 flex justify-between items-end mt-2 w-full">
                                {isManageMode ? (
                                    <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-200">
                                        <button onClick={(e) => { e.stopPropagation(); setEditingSub(row); setNewSubCategoryName(row.name); setIsModalOpen(true); }} className="flex-1 bg-blue-50 text-blue-600 p-1.5 rounded-lg flex justify-center"><Edit2 size={16}/></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(row._id); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-600 p-1.5 rounded-lg flex justify-center"><Trash2 size={16}/></button>
                                    </div>
                                ) : ( <><span className="text-[10px] text-gray-400 font-bold uppercase">Select</span><div className="bg-gray-50 p-1 rounded-full text-gray-400 group-hover:bg-primaryColor group-hover:text-white"><ChevronRight size={14} strokeWidth={3}/></div></> )}
                            </div>
                        </div>
                    );
                })}
                <button onClick={() => { setEditingSub(null); setNewSubCategoryName(''); setIsModalOpen(true); }} className='bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-2xl active:scale-[0.96] transition-all flex flex-col justify-center items-center h-36 hover:border-primaryColor group'><div className="bg-white p-3 rounded-full shadow-sm mb-2"><SquarePlus size={24} className="text-gray-400 group-hover:text-primaryColor" /></div><span className="text-sm font-bold text-gray-500">Add New</span></button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50"><h2 className="text-lg font-bold text-gray-800">{editingSub ? 'Edit Name' : 'New Sub Category'}</h2><button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input autoFocus type="text" value={newSubCategoryName} onChange={(e) => setNewSubCategoryName(e.target.value)} className="w-full px-3 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-primaryColor" placeholder="Name" />
                            <button type="submit" disabled={isCreating} className="w-full py-3 bg-primaryColor text-white font-bold rounded-xl flex justify-center gap-2">{isCreating ? <Loader2 className="animate-spin" size={20} /> : (editingSub ? "Update" : "Create")}</button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><AlertTriangle size={28} /></div>
                        <h3 className="text-lg font-bold mb-2">Delete?</h3>
                        <p className="text-sm text-gray-500 mb-6">This will delete all products inside.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold text-gray-700">Cancel</button>
                            <button onClick={confirmDelete} disabled={isCreating} className="flex-1 py-2.5 bg-red-600 rounded-xl font-bold text-white flex justify-center">{isCreating ? <Loader2 className="animate-spin" size={18}/> : "Delete"}</button>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
};

export default SubCategory;