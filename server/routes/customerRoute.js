import express from 'express';
import { createCustomer, getMyCustomers } from '../controllers/customerController.js';
import userAuth from '../middlewares/userAuth.js';


const customerRouter = express.Router();

customerRouter.post('/add', userAuth, createCustomer);
customerRouter.get('/all', userAuth, getMyCustomers);

export default customerRouter;