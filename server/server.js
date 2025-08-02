import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParserf from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config(); // Load environment variables from .env file
import userRouter from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

//const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());// Parse JSON bodies
app.use(cookieParserf());// Parse cookies
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.get('/', (req, res) => {
    res.send('api working fine');
});
app.use('/api/auth', authRoutes); // Use authentication routes
app.use('/api/user', userRouter); // Use user routes
app.use('/api/session', sessionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
