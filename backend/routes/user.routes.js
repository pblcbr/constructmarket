import express from 'express';
import User from '../models/User.model.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validation.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', verifyToken, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('phone')
    .optional()
    .matches(/^[0-9\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim(),
  body('currentProject')
    .optional()
    .trim(),
  body('avatar')
    .optional()
    .trim(),
  validate
], async (req, res, next) => {
  try {
    const { name, phone, company, currentProject, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (currentProject !== undefined) updateData.currentProject = currentProject;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', verifyToken, [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/\d/).withMessage('New password must contain at least one number'),
  validate
], async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only return public information unless it's the user themselves or admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        company: user.company,
        avatar: user.avatar
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
router.delete('/:id', verifyToken, isAdmin, validateObjectId, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

