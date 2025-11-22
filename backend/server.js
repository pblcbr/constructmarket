import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables FIRST before importing routes
dotenv.config();

// Debug: Check if Cloudinary vars are loaded
console.log('🔍 After dotenv.config():', {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? `✅ ${process.env.CLOUDINARY_NAME}` : '❌ Missing',
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY ? `✅ ${process.env.CLOUDINARY_KEY.substring(0, 5)}...` : '❌ Missing',
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ? `✅ ${process.env.CLOUDINARY_SECRET.substring(0, 5)}...` : '❌ Missing'
});

// Import routes (after dotenv is loaded)
import authRoutes from './routes/auth.routes.js';
import materialRoutes from './routes/material.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Create Express app
const app = express();

// ============================================
// CORS CONFIGURATION - MUST BE ABSOLUTELY FIRST
// ============================================
const allowedOrigin = process.env.ORIGIN || 'http://localhost:5173';

// Use cors package - the standard way to handle CORS in Express
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 204
}));

// Log OPTIONS requests for debugging
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('🔵 OPTIONS preflight:', req.method, req.path);
  }
  next();
});

// ============================================
// MIDDLEWARE (after CORS)
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Construction Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING
// ============================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${allowedOrigin}`);
  console.log(`📡 Allowed methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`);
});

export default app;
