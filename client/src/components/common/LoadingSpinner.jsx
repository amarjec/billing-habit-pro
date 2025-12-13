import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 40, color = "text-primaryColor" }) => {
    return (
        <div className='flex justify-center items-center h-64'>
            <Loader2 className={`animate-spin ${color}`} size={size} />
        </div>
    );
};

export default LoadingSpinner;