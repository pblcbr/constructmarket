import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Function to configure Cloudinary (called when needed)
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
  
  // Debug
  console.log('🔧 Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_NAME ? '✅ Set' : '❌ Missing',
    api_key: process.env.CLOUDINARY_KEY ? '✅ Set' : '❌ Missing',
    api_secret: process.env.CLOUDINARY_SECRET ? '✅ Set' : '❌ Missing'
  });
};

// Configure on first use
configureCloudinary();

/**
 * @route   POST /api/upload
 * @desc    Upload image to Cloudinary
 * @access  Private
 */
router.post('/', verifyToken, upload.single('image'), async (req, res, next) => {
  try {
    // Ensure Cloudinary is configured
    configureCloudinary();
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'construction-marketplace',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    next(error);
  }
});

export default router;

