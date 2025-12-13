import express from 'express';
import { 
    createQuote, 
    updateQuote, 
    updateQuoteStatus, // Import this
    getMyQuotes, 
    getQuoteById 
} from '../controllers/quoteController.js';
import userAuth from '../middlewares/userAuth.js';
import premiumAuth from '../middlewares/premiumAuth.js';

const quoteRouter = express.Router();

quoteRouter.post('/create', userAuth, premiumAuth, createQuote);
quoteRouter.put('/update/:quoteId', userAuth, premiumAuth, updateQuote);

// --- NEW ROUTE ---
quoteRouter.put('/status/:quoteId', userAuth, premiumAuth, updateQuoteStatus); 

quoteRouter.get('/all', userAuth, getMyQuotes);
quoteRouter.get('/:id', userAuth, getQuoteById);

export default quoteRouter;