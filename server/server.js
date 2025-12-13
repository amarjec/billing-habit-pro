import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/mongoDB.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import subCategoryRouter from './routes/subCategoryRoute.js';
import productRouter from './routes/productRoute.js';
import customerRouter from './routes/customerRoute.js';
import quoteRouter from './routes/quoteRoute.js';
import paymentRouter from './routes/paymentRoute.js';


const app = express();

const PORT = process.env.PORT || 8080;
await connectDB();

const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigin, credentials: true}));

app.get ('/', (req, res) => {
    res.send('Billing Habit Server is Running...');
})

//API Routes
app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subCategoryRouter); 
app.use('/api/product', productRouter);  
app.use('/api/customer',  customerRouter); 
app.use('/api/quote', quoteRouter);  
app.use('/api/payment', paymentRouter);





app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
})
export default app;


