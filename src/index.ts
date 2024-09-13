import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/user.route'; 
import bookRoutes from './routes/book.route';
import billRoutes from './routes/bill.route'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));




app.use('/api/v1/test', (req, res) => {
    res.send({
        testingAPI: "working"
    })
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/books', bookRoutes)
app.use('/api/v1/transactions', billRoutes)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});