import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Category from '../../pages/inventory/Category.jsx';
import Footer from '../../components/layout/Footer.jsx';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <Header />
            <div className="px-5 pb-2 rounded-b-[2.5rem] mb-6 transition-all">
                <div className="mt-6 relative">
                    <input type="text" placeholder="Search category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3.5 pl-12 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-green-400/30 text-gray-700 font-medium placeholder-gray-400 outline-none" />
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                </div>
            </div>
            <Category searchTerm={searchTerm} />
            <Footer />
        </div>
    );
};

export default Home;