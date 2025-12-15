import React, { useState } from 'react';
import { Mail, Phone, Send, MessageSquare, MapPin } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import InputField from '../../components/common/InputField.jsx';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent successfully!");
            setFormData({ subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Header />
            
            <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
                
                {/* Hero / Info Card */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <h2 className="text-2xl font-bold mb-2 relative z-10">Get in touch</h2>
                    <p className="text-slate-300 text-sm mb-6 relative z-10">Have a question or need support? We're here to help you grow your business.</p>
                    
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                            <div className="p-2 bg-white/10 rounded-lg"><Mail size={16}/></div>
                            <span>support@billinghabit.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                            <div className="p-2 bg-white/10 rounded-lg"><Phone size={16}/></div>
                            <span>+91 968520 8320</span>
                        </div>
                    </div>
                </div>

                {/* Message Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-slate-900"/> Send a Message
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField 
                            label="Subject" 
                            placeholder="What is this about?" 
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                        
                        <div className="relative">
                            <label className="text-[10px] font-bold text-gray-500 uppercase absolute left-3 top-3 z-10 tracking-wider">Message</label>
                            <textarea 
                                required
                                className="w-full pt-8 pb-3 px-3 border border-gray-200 rounded-xl outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all text-sm font-semibold text-slate-900 min-h-[120px] resize-none"
                                placeholder="Type your message here..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Sending..." : <><Send size={18} /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;