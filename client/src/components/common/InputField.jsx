import React from 'react';

const InputField = ({ 
    icon: Icon, 
    label, 
    type = "text", 
    value, 
    onChange, 
    name, 
    disabled = false, 
    placeholder,
    maxLength
}) => {
    return (
        <div className={`relative transition-opacity ${disabled ? 'opacity-90' : 'opacity-100'}`}>
            {label && (
                <label className="text-[10px] font-bold text-gray-500 uppercase absolute left-10 top-2 z-10">
                    {label}
                </label>
            )}
            <div className={`
                flex items-end pb-2 pt-5 px-3 border rounded-xl transition-all duration-200
                ${disabled 
                    ? 'bg-gray-50 border-transparent' 
                    : 'bg-white border-gray-300 focus-within:border-primaryColor focus-within:ring-4 focus-within:ring-green-50'
                }
            `}>
                {Icon && (
                    <Icon size={18} className={`mr-3 mb-0.5 ${disabled ? 'text-gray-400' : 'text-primaryColor'}`} />
                )}
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    maxLength={maxLength}
                    placeholder={placeholder || (disabled ? "Not set" : `Enter ${label}`)}
                    className="w-full text-sm text-gray-800 font-semibold outline-none bg-transparent placeholder:font-normal placeholder:text-gray-400"
                />
            </div>
        </div>
    );
};

export default InputField;