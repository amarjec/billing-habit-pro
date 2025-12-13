import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, User, Store, MapPin, Phone, Mail, Lock, Save, ArrowLeft, Edit2, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const { user, setUser, axios, navigate } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', shopName: '', number: '', address: '', pin: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '', email: user.email || '',
                shopName: user.shopName || '', number: user.number || '',
                address: user.address || '', pin: '' 
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.pin) delete payload.pin; 
            const res = await axios.post('/user/update-details', payload);
            if (res.data.success) {
                toast.success("Profile Updated!");
                setUser(res.data.user);
                setIsEditing(false);
            } else { toast.error(res.data.message || "Update Failed"); }
        } catch (error) { toast.error("Failed to update profile"); } 
        finally { setLoading(false); }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center gap-3">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"><ArrowLeft size={20} /></button>
                <h1 className="font-bold text-lg text-gray-800">My Profile</h1>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="ml-auto text-sm font-semibold text-primaryColor hover:bg-green-50 px-3 py-1.5 rounded-full transition-colors">Edit</button>}
            </div>

            <div className="relative">
                <div className="h-20 bg-linear-to-r from-primaryColor to-gray-700 w-full"></div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff&size=128`} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"/>
                        {isEditing && <div className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white shadow-sm"><Edit2 size={12} /></div>}
                    </div>
                </div>
            </div>

            <div className="mt-14 px-4 max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{formData.name || 'User'}</h2>
                    <p className="text-sm text-gray-500 font-medium">{formData.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"><ShieldCheck size={12}/> {user?.isPremium ? 'Premium Account' : 'Free Account'}</div>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Personal Details</h3>
                        <InputField icon={User} label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                        <InputField icon={Mail} label="Email Address" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                        <InputField icon={Phone} label="Mobile Number" name="number" type="tel" value={formData.number} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shop Details</h3>
                        <InputField icon={Store} label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} disabled={!isEditing} />
                        <InputField icon={MapPin} label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    {isEditing && (
                        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2"><Lock size={16}/> Security Update</h3>
                            <div className="bg-white rounded-xl border border-red-200 p-1 flex items-center focus-within:ring-2 focus-within:ring-red-500/50">
                                <input type="text" name="pin" maxLength={4} inputMode="numeric" placeholder="Set New 4-Digit PIN" value={formData.pin} onChange={handleChange} className="w-full p-2.5 text-sm outline-none font-bold text-center tracking-widest placeholder:tracking-normal placeholder:font-normal"/>
                            </div>
                            <p className="text-[10px] text-red-500 mt-2 ml-1 opacity-80">* Leave blank if you don't want to change your current PIN.</p>
                        </div>
                    )}

                    {isEditing && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-20">
                            <button type="button" onClick={() => { setIsEditing(false); setFormData(prev => ({...prev, pin: ''})); }} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Cancel</button>
                            <button type="submit" disabled={loading} className="flex-2 py-3.5 bg-primaryColor text-white rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg hover:bg-green-700">{loading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Save Changes</>}</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const InputField = ({ icon: Icon, label, name, value, onChange, disabled, type="text" }) => (
    <div className={`relative transition-opacity ${disabled ? 'opacity-90' : 'opacity-100'}`}>
        <label className="text-[10px] font-bold text-gray-500 uppercase absolute left-10 top-2 z-10">{label}</label>
        <div className={`flex items-end pb-2 pt-5 px-3 border rounded-xl transition-all duration-200 ${disabled ? 'bg-gray-50 border-transparent' : 'bg-white border-gray-300 focus-within:border-primaryColor'}`}>
            <Icon size={18} className={`mr-3 mb-0.5 ${disabled ? 'text-gray-400' : 'text-primaryColor'}`} />
            <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} placeholder={disabled ? "Not set" : `Enter ${label}`} className="w-full text-sm text-gray-800 font-semibold outline-none bg-transparent placeholder:font-normal placeholder:text-gray-400" />
        </div>
    </div>
);

export default Profile;