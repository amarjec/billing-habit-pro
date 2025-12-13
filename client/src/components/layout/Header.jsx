import React, { useState } from 'react';
import { Menu, Crown, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';
import Sidebar from './Sidebar.jsx';

const Header = () => {
    const { user, navigate } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isPremium = user?.isPremium;
    const isTrial = user?.planType === 'trial';
    const formattedExpiry = user?.expiryDate 
        ? new Date(user.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
        : null;

    return (
        <>
            <div className="bg-white shadow-sm p-4 sticky top-0 z-30">
                <div className="mx-auto flex items-center justify-between">
                    <div className='flex items-center gap-3 cursor-pointer' >  
                        <div onClick={() => setIsSidebarOpen(true)} className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Menu className='text-gray-700 h-6 w-6'/>
                        </div>
                        <div onClick={() => navigate('/')}>
                            <h1 className="text-sm text-gray-800 font-bold leading-tight truncate max-w-[140px]">
                                {user?.shopName || 'Billing Habit'}
                            </h1>
                            <p className='text-[10px] text-gray-500 font-medium truncate max-w-[140px]'>
                                {user?.address || 'Tap to configure'}
                            </p>
                        </div>
                    </div>

                    <div onClick={() => navigate('/pro')} className='cursor-pointer flex flex-col items-end'>
                        {isPremium ? (
                            <>
                                <div className={`rounded-full px-3 py-1 flex items-center gap-1.5 border ${isTrial ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                    <Crown size={14} className={isTrial ? "fill-blue-700" : "fill-amber-700"} />
                                    <span className='text-xs font-bold'>{isTrial ? 'Trial' : 'Pro'}</span>
                                </div>
                                <p className="text-[9px] text-gray-400 mt-0.5 font-medium tracking-wide">
                                    Exp: {formattedExpiry}
                                </p>
                            </>
                        ) : (
                            <div className='bg-red-50 border border-red-100 rounded-full px-3 py-1 flex items-center gap-1.5 text-red-600'>
                                <AlertCircle size={14} />
                                <span className='text-xs font-bold'>Free</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Header;