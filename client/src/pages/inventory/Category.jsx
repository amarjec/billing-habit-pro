import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Layers, ChevronRight, Plus, X, Edit2, Trash2, Settings, AlertTriangle } from 'lucide-react';

const Category = ({ searchTerm }) => {
    const { axios, setList } = useAppContext();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isManageMode, setIsManageMode] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    
    const [formData, setFormData] = useState({ name: '', desc: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setList({});
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/category/get-all');
                if (data.success) setCategories(data.categories);
            } catch (error) { toast.error("Failed to load categories"); } 
            finally { setLoading(false); }
        };
        fetchCategories();
    }, [axios, setList]);

    const handleOpenModal = (cat = null) => {
        setEditingCategory(cat ? cat._id : null);
        setFormData(cat ? { name: cat.name, desc: cat.desc || '' } : { name: '', desc: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Name is required");
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                const res = await axios.put(`/category/update/${editingCategory}`, formData);
                if (res.data.success) {
                    toast.success("Updated!");
                    setCategories(prev => prev.map(c => c._id === editingCategory ? { ...c, ...formData } : c));
                }
            } else {
                const res = await axios.post('/category/create', formData);
                if (res.data.success) {
                    toast.success("Created!");
                    setCategories([...categories, res.data.category]);
                }
            }
            setIsModalOpen(false);
        } catch (error) { toast.error("Operation failed"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsSubmitting(true);
        try {
            const res = await axios.delete(`/category/delete/${deleteId}`);
            if (res.data.success) {
                toast.success("Deleted");
                setCategories(prev => prev.filter(c => c._id !== deleteId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) { toast.error("Delete failed"); } 
        finally { setIsSubmitting(false); }
    };

    const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className='flex justify-center items-center h-40'><Loader2 className="animate-spin text-primaryColor" size={32} /></div>;

    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-800 text-lg">Categories</h2>
                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">{categories.length}</span>
                </div>
                <button onClick={() => setIsManageMode(!isManageMode)} className={`p-2 rounded-full transition-all ${isManageMode ? 'bg-primaryColor text-white shadow-lg' : 'bg-white text-gray-400'}`}><Settings size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-4">
                {filtered.map((cat) => (
                    <div key={cat._id} onClick={() => !isManageMode && navigate(`/sub-category/${cat._id}`)} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all duration-200 flex flex-col justify-between h-36 relative overflow-hidden group ${isManageMode ? 'border-primaryColor/30' : 'border-gray-100 active:scale-[0.96] cursor-pointer'}`}>
                        <div className="absolute -right-6 -top-6 w-20 h-20 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                        <div className="relative z-10 flex-1 flex flex-col items-start justify-center">
                            <div className="bg-green-50 p-2.5 rounded-full mb-3 text-primaryColor"><Layers size={20} /></div>
                            <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 text-[15px]">{cat.name}</h3>
                        </div>
                        <div className="relative z-10 flex justify-between items-end mt-2 w-full">
                            {isManageMode ? (
                                <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-200">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal(cat); }} className="flex-1 bg-blue-50 text-blue-600 p-2 rounded-lg flex justify-center"><Edit2 size={16}/></button>
                                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(cat._id); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg flex justify-center"><Trash2 size={16}/></button>
                                </div>
                            ) : (
                                <><span className="text-[10px] text-gray-400 font-bold uppercase">Select</span><div className="bg-gray-50 p-1.5 rounded-full text-gray-400 group-hover:bg-primaryColor group-hover:text-white"><ChevronRight size={14} strokeWidth={3}/></div></>
                            )}
                        </div>
                    </div>
                ))}
                <button onClick={() => handleOpenModal()} className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-2xl active:scale-[0.96] transition-all h-36 flex flex-col justify-center items-center group hover:border-primaryColor"><div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:text-primaryColor"><Plus size={24} className="text-gray-400"/></div><span className="text-sm font-bold text-gray-500">Add Category</span></button>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold text-lg text-gray-800">{editingCategory ? 'Edit' : 'New'} Category</h3><button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-500" /></button></div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <input autoFocus type="text" placeholder="Name" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primaryColor" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            <input type="text" placeholder="Description (Optional)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primaryColor" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
                            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-primaryColor text-white font-bold rounded-xl">{isSubmitting ? <Loader2 className="animate-spin" size={20}/> : "Save"}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><AlertTriangle size={28}/></div>
                        <h3 className="text-lg font-bold mb-2">Delete Category?</h3>
                        <p className="text-sm text-gray-500 mb-6">This will delete ALL products inside.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold text-gray-700">Cancel</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 rounded-xl font-bold text-white flex justify-center">{isSubmitting ? <Loader2 className="animate-spin" size={18}/> : "Delete"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;