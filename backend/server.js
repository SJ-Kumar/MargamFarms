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
import purchaseRoutes from './routes/purchaseRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import billRoutes from './routes/billRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import oilcakeRoutes from './routes/oilcakeRoutes.js'
import cors from 'cors';
const port = process.env.PORT || 5000;

connectDB();
const app=express();
app.use(cors(
{
      origin: [""],
      methods: ["POST", "GET"],
      credentials: true
}
));
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//Cookie Parser Middleware
app.use(cookieParser());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/purchases',purchaseRoutes);
app.use('/api/bills',billRoutes);
app.use('/api/salarys',salaryRoutes);
app.use('/api/transports',transportRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/oilcakes',oilcakeRoutes);
app.use('/api/upload', uploadRoutes);
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'),function (err) {
          if(err) {
              res.status(500).send(err)
          }
      });
  })
}
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
app.use(notFound);
app.use(errorHandler);
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);