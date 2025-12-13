import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx'; 
import { Home, FileText } from 'lucide-react';

const Footer = () => {
    const { navigate } = useAppContext();
    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { name: 'New Bill', icon: Home, path: '/' }, 
        { name: 'History', icon: FileText, path: '/history' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] safe-area-pb">
            <div className="grid grid-cols-2 h-[60px]">
                {navLinks.map((link) => {
                    const isActive = currentPath === link.path;
                    return (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 active:bg-gray-50 ${isActive ? 'text-primaryColor' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                            <div className={`absolute top-0 w-16 h-1 rounded-b-full bg-primaryColor transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                            <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-200 ${isActive ? '-translate-y-0.5' : ''}`} />
                            <span className="text-[10px] font-bold tracking-wide">{link.name}</span>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};

export default Footer;