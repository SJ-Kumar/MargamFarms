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
import uploadRoutes from './routes/uploadRoutes.js';
import cors from 'cors';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 5000;

connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();
app.use(cors(
{
      origin: ["https://margamfarms.vercel.app"],
      //methods: ["POST", "GET"],
      //credentials: true
}
));
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Cookie Parser Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));




  app.get("*", function(req, res){
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'),function (err) {
          if(err) {
              res.status(500).send(err)
          }
      });
  })


/*     app.get('/', (req, res) => {
      res.send('API is running....');
    }); */


app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

