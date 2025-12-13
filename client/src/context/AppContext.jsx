import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/constants.js";

axios.defaults.withCredentials = true; 
axios.defaults.baseURL = API_BASE_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    
    // --- Persistent State ---
    const [list, setList] = useState(() => {
        try {
            const saved = localStorage.getItem('billing_list');
            return saved ? JSON.parse(saved) : {};
        } catch (error) { return {}; }
    });

    const [selectedCustomer, setSelectedCustomer] = useState(() => {
        try {
            const saved = localStorage.getItem('billing_customer');
            return saved ? JSON.parse(saved) : null;
        } catch (error) { return null; }
    });
    
    const [draftQuote, setDraftQuote] = useState(() => {
        try {
            const saved = localStorage.getItem('billing_draft_quote');
            return saved ? JSON.parse(saved) : null;
        } catch (error) { return null; }
    });

    const navigate = useNavigate();
    const location = useLocation(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    // --- Persistence Effects ---
    useEffect(() => { localStorage.setItem('billing_list', JSON.stringify(list)); }, [list]);
    useEffect(() => {
        if (selectedCustomer) localStorage.setItem('billing_customer', JSON.stringify(selectedCustomer));
        else localStorage.removeItem('billing_customer');
    }, [selectedCustomer]);
    useEffect(() => {
        if (draftQuote) localStorage.setItem('billing_draft_quote', JSON.stringify(draftQuote));
        else localStorage.removeItem('billing_draft_quote');
    }, [draftQuote]);

    // --- Session Management ---
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await axios.get("/user/profile");
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log('No active session found.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    // --- Logout ---
    const logout = useCallback(async () => {
        try {
            await axios.post("/user/logout");
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            setList({});
            setSelectedCustomer(null);
            setDraftQuote(null);
            localStorage.removeItem('billing_list');
            localStorage.removeItem('billing_customer');
            localStorage.removeItem('billing_draft_quote');
        }
    }, []);

    const value = useMemo(() => ({
        axios, navigate, location, logout, 
        user, setUser, loading, setLoading,
        list, setList, selectedCustomer, setSelectedCustomer,
        draftQuote, setDraftQuote
    }), [axios, navigate, location, user, loading, logout, list, selectedCustomer, draftQuote]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);