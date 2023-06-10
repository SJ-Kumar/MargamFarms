import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripe from './routes/stripe.js';

const port = process.env.PORT || 5000;

connectDB();
const app=express();


//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Cookie Parser Middleware
app.use(cookieParser());

app.get('/',(req,res) => { 
    res.send("API Running Bhaiya..");
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripe);

app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server running on port ${port}`));

