import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import userAuth from '../middlewares/userAuth.js';

const paymentRouter = express.Router();

paymentRouter.post('/order', userAuth, createOrder);
paymentRouter.post('/verify', userAuth, verifyPayment);

export default paymentRouter;