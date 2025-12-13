import React from 'react';
import { X, Home, Package, FileText, User, Crown, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout, navigate } = useAppContext();

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
            <div className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="bg-primaryColor p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden bg-white/20 shadow-inner">
                            <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight line-clamp-1">{user?.shopName || "My Shop"}</h2>
                            <p className="text-xs text-green-100 opacity-90">{user?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-180px)]">
                    <MenuItem icon={Home} label="Home" onClick={() => handleNavigate('/')} />
                    <MenuItem icon={FileText} label="History / Quotes" onClick={() => handleNavigate('/history')} />
                    <MenuItem icon={Package} label="Manage Inventory" onClick={() => handleNavigate('/manage-products')} />
                    <MenuItem icon={User} label="My Profile" onClick={() => handleNavigate('/profile')} />
                    <div className="h-px bg-gray-100 my-2"></div>
                    <MenuItem icon={Crown} label="Upgrade Plan" onClick={() => handleNavigate('/pro')} highlight badge={user?.isPremium ? "PRO" : "FREE"} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut size={20} /><span>Logout</span>
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-2">v1.2.0 • Billing Habit</p>
                </div>
            </div>
        </>
    );
};

const MenuItem = ({ icon: Icon, label, onClick, highlight, badge }) => (
    <button onClick={onClick} className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${highlight ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'text-gray-700 hover:bg-gray-50'}`}>
        <div className="flex items-center gap-3"><Icon size={20} className={highlight ? "text-amber-600" : "text-gray-500"} /><span className="font-medium text-sm">{label}</span></div>
        {badge ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === "PRO" ? "bg-amber-200 text-amber-800" : "bg-gray-200 text-gray-600"}`}>{badge}</span> : <ChevronRight size={16} className="text-gray-300" />}
    </button>
);

export default Sidebar;