import express from 'express';
import path from 'path';
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

/*
app.get('/', (req, res) => {
  res.send('API is running....');
});
*/


//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Cookie Parser Middleware
app.use(cookieParser());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripe);

app.use(notFound);
app.use(errorHandler);


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
}

app.listen(port, () => console.log(`Server running on port ${port}`));

