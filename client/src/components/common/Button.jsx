import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component
 * * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - loading: boolean (shows spinner)
 * - icon: Lucide Icon Component (optional)
 * - disabled: boolean
 * - onClick: function
 * - type: 'button' | 'submit'
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'lg', 
    loading = false, 
    disabled = false, 
    type = 'button',
    icon: Icon,
    className = '' 
}) => {

    // --- Style Configurations ---
    
    const baseStyles = "rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primaryColor text-white hover:bg-green-700 shadow-lg shadow-green-600/20",
        secondary: "bg-secondaryColor text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20",
        outline: "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    };

    const sizes = {
        sm: "py-2 px-3 text-xs",
        md: "py-2.5 px-4 text-sm",
        lg: "py-3.5 px-6 text-lg"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${baseStyles} 
                ${variants[variant]} 
                ${sizes[size]} 
                ${className}
            `}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={size === 'lg' ? 22 : 18} />
            ) : (
                <>
                    {Icon && <Icon size={size === 'lg' ? 22 : 18} strokeWidth={2.5} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;