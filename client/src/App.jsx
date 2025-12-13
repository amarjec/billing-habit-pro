import React from 'react';
import { useAppContext } from './context/AppContext.jsx';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/dashboard/Home.jsx';
import Login from './pages/auth/Login.jsx';
import SubCategory from './pages/inventory/SubCategory.jsx';
import Product from './pages/inventory/Product.jsx';
import ManageProducts from './pages/inventory/ManageProducts.jsx';
import Customer from './pages/billing/Customer.jsx';
import FinalQuotation from './pages/billing/FinalQuotation.jsx';
import QuoteDetails from './pages/billing/QuoteDetails.jsx';
import History from './pages/dashboard/History.jsx';
import Profile from './pages/dashboard/Profile.jsx';
import Subscription from './pages/dashboard/Subscription.jsx';
import Download from './pages/dashboard/Download.jsx';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAppContext();
  if (loading) return null; 
  return user ? element : <Navigate to="/login" replace />;
};

const PremiumRoute = ({ element }) => {
  const { user, loading } = useAppContext();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isPremium) return <Navigate to="/pro" replace />;
  return element;
};

const App = () => {
  const { user, setUser } = useAppContext();
  return (
    <div className='w-full min-h-screen overflow-hidden bg-bgColor'>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={!user ? (<Login onLoginSuccess={setUser} />) : (<Navigate to="/" replace />)} /> 
        <Route path="/download" element={<Download />} />
        <Route path="/pro" element={<ProtectedRoute element={<Subscription />} />} />
        
        <Route path='/' element={<ProtectedRoute element={<Home />} />} />
        <Route path='/sub-category/:categoryId' element={<ProtectedRoute element={<SubCategory />} />} /> 
        <Route path='/customer' element={<ProtectedRoute element={<Customer />} />} />
        <Route path="/manage-products" element={<ProtectedRoute element={<ManageProducts />} />} />
        <Route path="/history" element={<ProtectedRoute element={<History/>} />} />
        <Route path="/quote-details/:quoteId" element={<ProtectedRoute element={<QuoteDetails />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        <Route path='/products/:subCategoryId' element={<PremiumRoute element={<Product />} />} />
        <Route path='/view-quote' element={<PremiumRoute element={<FinalQuotation />} />} />
        
        <Route path='*' element={<ProtectedRoute element={<Home />} />} />
      </Routes>
    </div>
  )
}

export default App;