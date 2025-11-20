// server.js
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';


dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


connectDB()

app.use(express.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use('/api/cart', cartRouter);
app.use('/api/auth',authRouter)
app.use('/api' ,productRouter);

app.disable("etag"); 

app.use((error,req, res,next) => {
    res.status(error.code || 500).json({
        message: error.message || "An unknown error occurred",
    });
});

app.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`);
})