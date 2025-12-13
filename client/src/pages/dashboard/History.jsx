import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { Loader2, Search, Calendar, Filter, Briefcase, Tag } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { STATUS_COLORS } from '../../config/constants.js';

const History = () => {
    const { navigate, setList, setSelectedCustomer, axios } = useAppContext();
    const [quotes, setQuotes] = useState([]); 
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All'); 

    useEffect(() => {
        setList({}); setSelectedCustomer(null);
        const fetch = async () => {
            try {
                const res = await axios.get('/quote/all');
                if (res.data.success) { setQuotes(res.data.quotes || []); setFilteredQuotes(res.data.quotes || []); }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetch();
    }, [setList, setSelectedCustomer, axios]);

    useEffect(() => {
        if (!quotes) return;
        const results = quotes.filter(quote => {
            const matchSearch = (quote.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || quote._id.includes(searchTerm);
            const matchStatus = statusFilter === 'All' || quote.status === statusFilter;
            const matchType = typeFilter === 'All' || (quote.quoteType || 'Retail') === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
        setFilteredQuotes(results);
    }, [searchTerm, statusFilter, typeFilter, quotes]);

    if (loading) return <><Header /><div className='flex justify-center items-center h-64'><Loader2 className="animate-spin text-primaryColor" size={40} /></div></>;

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header />
            <div className="sticky top-[72px] z-10 bg-gray-50 pt-2 pb-2 shadow-sm border-b border-gray-200">
                <div className="px-4 mb-3 relative">
                    <input type="text" placeholder="Search Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border rounded-xl shadow-sm outline-none" />
                    <Search className="absolute left-7 top-3.5 text-gray-400" size={20} />
                </div>
                <div className="flex flex-col gap-2 px-4">
                    <div className="flex gap-2">{['All', 'Retail', 'Wholesale'].map((type) => (<button key={type} onClick={() => setTypeFilter(type)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${typeFilter === type ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>{type}</button>))}</div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">{['All', 'Pending', 'Delivered', 'Cancelled'].map((status) => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${statusFilter === status ? 'bg-primaryColor text-white' : 'bg-white text-gray-600'}`}>{status}</button>))}</div>
                </div>
            </div>
            <div className="px-2 mt-3">
                {filteredQuotes.length === 0 ? <div className="flex flex-col items-center mt-12 text-gray-400"><Filter size={48} className="opacity-20"/><p>No quotes.</p></div> : filteredQuotes.map(quote => (
                    <div key={quote._id} onClick={() => navigate(`/quote-details/${quote._id}`)} className="bg-white rounded-xl shadow-sm p-4 mb-3 border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-transform">
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${quote.status === 'Delivered' ? 'bg-green-500' : quote.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div className="pl-3">
                            <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">{quote.customer?.name}</h3><span className="font-black text-gray-900">₹{quote.totalAmount?.toFixed(0)}</span></div>
                            <div className="flex justify-between items-center mt-2"><div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[quote.status] || STATUS_COLORS.DEFAULT}`}>{quote.status}</div><div className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={12}/><span>{new Date(quote.createdAt).toLocaleDateString('en-GB')}</span></div></div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default History;