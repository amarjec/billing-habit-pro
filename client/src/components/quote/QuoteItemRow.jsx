import React from 'react';
import { Pencil, Check } from 'lucide-react';

const QuoteItemRow = ({ item, isEditing, onEditClick, onUpdate, isWholesaleMode }) => {
    
    // Check Modified Status against ACTIVE mode price
    const referencePrice = isWholesaleMode ? item.wholesalePrice : item.retailPrice;
    const isModified = item.sellingPrice !== referencePrice;

    return (
        <div className={`grid grid-cols-12 gap-2 items-center px-3 py-3 border-b border-gray-50 transition-colors ${isEditing ? 'bg-blue-50' : 'bg-white'}`}>
            {/* Name */}
            <div className="col-span-5 flex flex-col justify-center min-w-0 pr-1">
                <span className="text-sm font-medium leading-snug truncate text-gray-800">{item.label}</span>
                {isModified && !isEditing && <div className="no-print mt-0.5"><span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Modified</span></div>}
            </div>

            {/* Qty & Unit */}
            <div className="col-span-2 flex justify-center items-center gap-1">
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input type="number" className="w-12 border border-blue-400 rounded px-1 text-center text-sm focus:outline-none py-1" value={item.quantity} onChange={(e) => onUpdate(item._id, 'quantity', e.target.value)} />
                        <span className="text-[10px] text-gray-400 font-medium">{item.unit}</span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">{item.quantity} <span className="text-[10px] text-gray-400">{item.unit}</span></span>
                )}
            </div>

            {/* Price */}
            <div className="col-span-2 flex justify-end">
                {isEditing ? (
                    <input type="number" className="w-16 border border-blue-400 rounded px-1 text-right text-sm focus:outline-none py-1" value={item.sellingPrice} onChange={(e) => onUpdate(item._id, 'sellingPrice', e.target.value)} />
                ) : (
                    <span className={`text-sm ${isModified ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>₹{item.sellingPrice}</span>
                )}
            </div>

            {/* Total */}
            <div className="col-span-3 text-right flex items-center justify-end gap-2 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900">₹{item.total.toFixed(0)}</span>
                <button onClick={() => onEditClick(isEditing ? null : item._id)} className={`p-1.5 rounded-full no-print transition-colors ${isEditing ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'}`}>
                    {isEditing ? <Check size={14} /> : <Pencil size={12}/>}
                </button>
            </div>
        </div>
    );
};

export default QuoteItemRow;