import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, Check, Zap, Crown, ShieldCheck } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { RAZORPAY_KEY } from '../../config/constants.js';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-checkout-js')) return resolve(true);
        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PlanCard = ({ title, price, duration, planId, features, onBuy, loading, icon: Icon, isPopular, saveText }) => (
    <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 transform ${isPopular ? 'border-amber-400 bg-linear-to-b from-amber-50 to-white shadow-xl scale-[1.02] z-10' : 'border-gray-200 bg-white shadow-md hover:shadow-lg'}`}>
        {isPopular && <div className="absolute top-0 right-0"><div className="bg-amber-400 text-amber-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">BEST VALUE</div></div>}
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isPopular ? 'bg-amber-100 text-amber-600' : 'bg-green-50 text-primaryColor'}`}><Icon size={28} strokeWidth={isPopular ? 2.5 : 2} /></div>
                {saveText && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">{saveText}</span>}
            </div>
            <div className="mb-6"><h3 className={`text-lg font-bold ${isPopular ? 'text-gray-900' : 'text-gray-700'}`}>{title} Plan</h3><div className="flex items-baseline mt-1"><span className="text-4xl font-black text-gray-900">₹{price}</span><span className="text-gray-500 font-medium ml-1">/{duration}</span></div></div>
            <ul className="space-y-3.5 mb-8">{features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium"><div className={`mt-0.5 rounded-full p-0.5 ${isPopular ? 'bg-amber-200 text-amber-800' : 'bg-green-100 text-green-700'}`}><Check size={12} strokeWidth={3} /></div><span className="leading-snug">{feature}</span></li>))}</ul>
            <button onClick={() => onBuy(planId)} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isPopular ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>{loading ? <Loader2 className="animate-spin" size={20}/> : (isPopular ? "Get Premium" : "Choose Monthly")}</button>
        </div>
    </div>
);

const Subscription = () => {
    const { axios, navigate, setUser } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (planId) => {
        setLoading(true);
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) { toast.error("Failed to load payment gateway"); setLoading(false); return; }

        try {
            const orderRes = await axios.post('/payment/order', { planId });
            if (!orderRes.data.success) throw new Error(orderRes.data.message || "Order failed");
            const { order } = orderRes.data;

            const options = {
                key: RAZORPAY_KEY, 
                amount: order.amount,
                currency: "INR",
                name: "Billing Habit Pro",
                description: `${planId === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post('/payment/verify', { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, planId });
                        if (verifyRes.data.success) { setUser(verifyRes.data.user); toast.success("Welcome to Pro!", { duration: 4000, icon: '🎉' }); navigate('/'); } 
                        else { toast.error("Verification failed"); }
                    } catch (err) { toast.error("Verification error"); }
                },
                theme: { color: "#047857" }, 
                modal: { ondismiss: () => setLoading(false) }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) { toast.error("Purchase failed."); setLoading(false); }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-32">
            <Header />
            <div className="relative bg-primaryColor px-4 pt-8 pb-12 rounded-b-[3rem] shadow-sm mb-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-10 pointer-events-none"></div>
                <div className="relative z-10"><div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold mb-4 border border-white/20"><Crown size={14} className="text-amber-300 fill-amber-300" /> PRO EDITION</div><h1 className="text-3xl font-black text-white mb-2 tracking-tight">Upgrade Your Shop</h1><p className="text-green-100 text-sm max-w-xs mx-auto leading-relaxed">Remove limits, track profits, and grow your business faster.</p></div>
            </div>
            <div className="max-w-lg mx-auto px-4 -mt-8 space-y-6">
                <PlanCard title="Yearly" price="999" duration="year" planId="yearly" icon={Crown} isPopular={true} saveText="SAVE ₹1400" features={['Everything in Monthly', '2 Months Free Included', 'Exclusive Gold App Badge', 'Early Access to New Features']} onBuy={handlePurchase} loading={loading} />
                <PlanCard title="Monthly" price="199" duration="mo" planId="monthly" icon={Zap} isPopular={false} features={['Create Unlimited Quotations', 'Unlock Profit Analysis', 'Remove "Free Plan" Watermark', 'Priority Chat Support']} onBuy={handlePurchase} loading={loading} />
                <div className="flex flex-col items-center gap-2 pt-4"><div className="flex items-center gap-2 text-gray-400 text-xs font-medium"><ShieldCheck size={14} /><span>Secured by Razorpay</span><span className="w-1 h-1 bg-gray-300 rounded-full"></span><span>Cancel Anytime</span></div></div>
            </div>
            <Footer />
        </div>
    );
};

export default Subscription;