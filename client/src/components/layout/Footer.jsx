import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx'; 
import { Home, FileText, Package, Crown } from 'lucide-react';

const Footer = () => {
    const { navigate } = useAppContext();
    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { name: 'Home', icon: Home, path: '/home' }, 
        { name: 'Product', icon: Package, path: '/manage-products' },
        { name: 'History', icon: FileText, path: '/history' },
    ];

    // --- Styling Variables (Using Dark Blue/Slate as the active accent) ---
    const activeColor = 'text-slate-900'; // Dark Accent
    const inactiveColor = 'text-gray-500';
    const activeBg = 'bg-blue-50'; 
    const gridCols = `grid-cols-${navLinks.length}`;

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] safe-area-pb">
            <div className={`grid ${gridCols} h-[60px]`}>
                {navLinks.map((link) => {
                    const isActive = link.path === '/homw' 
                        ? currentPath === '/home' || currentPath.startsWith('/sub-category') || currentPath.startsWith('/products') || currentPath.startsWith('/customer') || currentPath.startsWith('/view-quote')
                        : currentPath.startsWith(link.path);
                    
                    return (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`relative flex flex-col items-center justify-center gap-0.5 px-2 transition-all duration-200 active:bg-gray-50 
                                ${isActive ? activeColor : inactiveColor} hover:text-gray-700`}
                        >
                            {/* 1. Pill Background Highlight */}
                            <div className={`absolute inset-x-2 inset-y-1.5 rounded-xl transition-all duration-200 
                                ${isActive ? activeBg : 'bg-transparent'}`} 
                            />
                            
                            {/* 2. Icon (Layered above the background, no shift) */}
                            <link.icon 
                                size={22} 
                                strokeWidth={isActive ? 3 : 2} 
                                className="relative z-10 transition-colors" 
                            />
                            
                            {/* 3. Label */}
                            <span className="text-[10px] font-extrabold tracking-wide relative z-10">{link.name}</span>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};

export default Footer;