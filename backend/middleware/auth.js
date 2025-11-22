import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Middleware to verify JWT token and authenticate user
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Authorization denied.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Get user from database (excluding password)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found. Authorization denied.' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'User account is inactive. Please contact administrator.' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token. Authorization denied.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please log in again.' 
      });
    }
    next(error);
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

/**
 * Middleware to check if user owns the resource
 * Expects resourceUserId to be set in req.resourceUserId by the route handler
 */
export const isOwner = (req, res, next) => {
  const resourceUserId = req.resourceUserId;
  
  if (!resourceUserId) {
    return res.status(500).json({ 
      message: 'Server error: Resource user ID not set' 
    });
  }

  if (req.user._id.toString() === resourceUserId.toString() || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. You do not have permission to access this resource.' 
    });
  }
};

export default { verifyToken, isAdmin, isOwner };

