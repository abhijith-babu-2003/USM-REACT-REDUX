import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
dotenv.config();
connect();

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/admin',adminRoutes)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
});