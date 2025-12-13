import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const BottomNav = () => {
    const { list, setList, navigate } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClear = () => {
        if (isSubmitting) return; 
        setList({});
        toast.success("List cleared!");
    };

    const handleGetQuote = async () => {
        setIsSubmitting(true);
        if (Object.keys(list).length === 0) {
            toast.error("Your quotation list is empty.");
            setIsSubmitting(false);
            return; 
        }
        navigate('/customer');
        setIsSubmitting(false);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t-2 z-10 p-4 flex items-center gap-4">
            <button type="button" onClick={handleClear} className="flex-1 w-full py-3 px-4 rounded-md text-gray-700 font-semibold text-lg flex items-center justify-center gap-2 transition-all bg-gray-200 hover:bg-gray-300">
                <Trash2 size={20} /> Clear
            </button>
            <button type="button" onClick={handleGetQuote} className="flex-1 w-full py-3 px-4 rounded-md text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all bg-secondaryColor hover:bg-amber-600">
                <FileText size={20} /> Get Quote
            </button>
        </div>
    );
};

export default BottomNav;