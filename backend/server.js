import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EV Station Finder Backend is running',
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('EV Station Finder Backend API');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});