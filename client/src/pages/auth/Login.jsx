import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../config/firebase';
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; 
import { Store, MapPin, Phone, Lock, ChevronRight, CheckCircle2, Zap, Briefcase, Check, Loader2 } from 'lucide-react'; 
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Login = ({ onLoginSuccess }) => {
  const { axios, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  
  const [formData, setFormData] = useState({ shopName: '', address: '', number: '', pin: '', businessTypes: [] });

  const businessOptions = [
      { id: 'electrical', label: 'Electrical' }, { id: 'sanitary', label: 'Sanitary / Hardware' },
      { id: 'grocery', label: 'Grocery / Kirana' }, { id: 'mobile', label: 'Mobile Shop' },
      { id: 'machinery', label: 'Machinery' }, { id: 'other', label: 'Other' }
  ];

  useEffect(() => {
      if (user && (!user.shopName || !user.pin || !user.number)) { setTempUserId(user._id); setShowOnboarding(true); }
  }, [user]);

  const toggleBusinessType = (id) => {
      setFormData(prev => {
          const current = prev.businessTypes;
          if (current.includes(id)) return { ...prev, businessTypes: current.filter(item => item !== id) };
          else return { ...prev, businessTypes: [...current, id] };
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithPopup(auth, provider).then(async (result) => {
        const googleUser = result.user;
        try {
          const res = await axios.post('/user/google-login', { email: googleUser.email, name: googleUser.displayName, photo: googleUser.photoURL });
          if (res.data.success) {
             if (res.data.requiresPhone) { setTempUserId(res.data.user?._id); setShowOnboarding(true); setLoading(false); } 
             else { onLoginSuccess(res.data.user); toast.success("Welcome back!"); }
          } else { toast.error(res.data.message || "Login failed"); setLoading(false); }
        } catch (err) { toast.error("Server error"); setLoading(false); }
      }).catch(() => setLoading(false));
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    if(!formData.shopName || !formData.address || !formData.number || !formData.pin) return toast.error("Please fill all fields");
    if(formData.businessTypes.length === 0) return toast.error("Select business type");
    if(formData.pin.length !== 4) return toast.error("PIN must be 4 digits");

    setLoading(true);
    try {
        const targetId = tempUserId || user?._id;
        if (!targetId) return toast.error("Session error.");
        const res = await axios.post('/user/update-details', { userId: targetId, ...formData, businessType: formData.businessTypes });
        if (res.data.success) { toast.success("Setup Complete!"); onLoginSuccess(res.data.user); } 
        else { toast.error(res.data.message); }
    } catch (err) { toast.error("Network error"); } finally { setLoading(false); }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans'>
      {/* Background blobs omitted for brevity, keep your original ones */}
      <div className="flex-1 flex flex-col justify-center p-6 z-10 relative max-w-md mx-auto w-full">
        {!showOnboarding ? (
            <div className="flex flex-col h-full justify-between py-10">
                <div className="mt-8">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8"><Store className="text-white w-8 h-8" /></div>
                    <h1 className="text-5xl font-black mb-4">Master <br/> Your Shop.</h1>
                    <div className="space-y-4">{[{ text: 'Instant Quotations', icon: Zap }, { text: 'Profit Tracking', icon: CheckCircle2 }, { text: 'Secure Cloud', icon: Lock }].map((f, i) => (<div key={i} className="flex items-center gap-3 text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50"><f.icon size={18} /><span className="font-medium">{f.text}</span></div>))}</div>
                </div>
                <div className="w-full mt-8"><button onClick={handleGoogleLogin} disabled={loading} className='w-full bg-white text-slate-950 h-14 rounded-2xl font-bold flex items-center justify-center gap-3'>{loading ? <Loader2 className="animate-spin"/> : <><FcGoogle className="text-2xl" /> Continue with Google</>}</button></div>
            </div>
        ) : (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6 rounded-4xl shadow-2xl overflow-y-auto max-h-[85vh]">
                <h2 className='text-2xl font-bold mb-6 text-center'>Setup Your Shop</h2>
                <form onSubmit={handleCompleteSetup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">{businessOptions.map((opt) => (<button key={opt.id} type="button" onClick={() => toggleBusinessType(opt.id)} className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${formData.businessTypes.includes(opt.id) ? 'bg-blue-600 border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>{opt.label} {formData.businessTypes.includes(opt.id) && <Check size={14}/>}</button>))}</div>
                    <div className="relative group"><Store className="absolute left-4 top-3.5 text-slate-500 pointer-events-none" size={20} /><input className="w-full bg-slate-950 border border-slate-800 p-3.5 pl-12 rounded-xl focus:border-blue-500 outline-none" placeholder="Shop Name" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} /></div>
                    <div className="relative group"><MapPin className="absolute left-4 top-3.5 text-slate-500 pointer-events-none" size={20} /><input className="w-full bg-slate-950 border border-slate-800 p-3.5 pl-12 rounded-xl focus:border-blue-500 outline-none" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                    <div className="relative group"><Phone className="absolute left-4 top-3.5 text-slate-500 pointer-events-none" size={20} /><input type="tel" className="w-full bg-slate-950 border border-slate-800 p-3.5 pl-12 rounded-xl focus:border-blue-500 outline-none" placeholder="Mobile" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} /></div>
                    <div className="relative group"><Lock className="absolute left-4 top-3.5 text-slate-500 pointer-events-none" size={20} /><input type="tel" maxLength={4} className="w-full bg-slate-950 border border-slate-800 p-3.5 pl-12 rounded-xl tracking-[0.5em] text-center font-bold focus:border-blue-500 outline-none" placeholder="PIN" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} /></div>
                    <button disabled={loading} className='w-full bg-blue-600 p-4 rounded-xl font-bold mt-4 flex justify-center'>{loading ? <Loader2 className="animate-spin"/> : "Finish Setup"}</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;