import express from 'express';
import Material from '../models/Material.model.js';
import { verifyToken } from '../middleware/auth.js';
import { validateMaterial, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/materials
 * @desc    Get all materials with filters and pagination
 * @access  Public
 */
router.get('/', validatePagination, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      status = 'disponible',
      minPrice,
      maxPrice,
      condition,
      search,
      seller,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (condition) filter.condition = condition;
    if (seller) filter.seller = seller;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [materials, total] = await Promise.all([
      Material.find(filter)
        .populate('seller', 'name email phone company currentProject')
        .sort(sort)
        .limit(Number(limit))
        .skip(skip),
      Material.countDocuments(filter)
    ]);

    res.status(200).json({
      materials,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/materials/:id
 * @desc    Get single material by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('seller', 'name email phone company currentProject avatar');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json(material);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/materials
 * @desc    Create new material
 * @access  Private
 */
router.post('/', verifyToken, validateMaterial, async (req, res, next) => {
  try {
    const materialData = {
      ...req.body,
      seller: req.user._id
    };

    const material = await Material.create(materialData);
    await material.populate('seller', 'name email phone company');

    res.status(201).json({
      message: 'Material created successfully',
      material
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/materials/:id
 * @desc    Update material
 * @access  Private (only seller or admin)
 */
router.put('/:id', verifyToken, validateObjectId, validateMaterial, async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user is the seller or admin
    if (material.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own materials.' 
      });
    }

    // Prevent updating sold materials
    if (material.status === 'vendido') {
      return res.status(400).json({ 
        message: 'Cannot update material with completed transactions' 
      });
    }

    // Update material
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('seller', 'name email phone company');

    res.status(200).json({
      message: 'Material updated successfully',
      material: updatedMaterial
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/materials/:id/status
 * @desc    Update material status
 * @access  Private (only seller or admin)
 */
router.patch('/:id/status', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['disponible', 'reservado', 'vendido'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user is the seller or admin
    if (material.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own materials.' 
      });
    }

    // Prevent changing status of sold materials
    if (material.status === 'vendido') {
      return res.status(400).json({ 
        message: 'Cannot change status of material with completed transactions' 
      });
    }

    material.status = status;
    await material.save();

    res.status(200).json({
      message: 'Material status updated successfully',
      material
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/materials/:id
 * @desc    Delete material
 * @access  Private (only seller or admin)
 */
router.delete('/:id', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user is the seller or admin
    if (material.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own materials.' 
      });
    }

    // Prevent deleting sold materials (materials with completed transactions)
    if (material.status === 'vendido') {
      return res.status(400).json({ 
        message: 'Cannot delete material with completed transactions' 
      });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/materials/seller/:sellerId
 * @desc    Get all materials by seller
 * @access  Public
 */
router.get('/seller/:sellerId', async (req, res, next) => {
  try {
    const materials = await Material.find({ seller: req.params.sellerId })
      .populate('seller', 'name email phone company')
      .sort('-createdAt');

    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
});

export default router;

