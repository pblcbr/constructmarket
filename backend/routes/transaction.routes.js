import express from 'express';
import Transaction from '../models/Transaction.model.js';
import Material from '../models/Material.model.js';
import { verifyToken } from '../middleware/auth.js';
import { validateTransaction, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for logged-in user (as buyer or seller)
 * @access  Private
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    // Build filter
    const filter = {};
    
    if (role === 'buyer') {
      filter.buyer = userId;
    } else if (role === 'seller') {
      filter.seller = userId;
    } else {
      // Get both buyer and seller transactions
      filter.$or = [{ buyer: userId }, { seller: userId }];
    }

    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('buyer', 'name email phone company')
        .populate('seller', 'name email phone company')
        .populate('material', 'title category images status')
        .sort('-createdAt')
        .limit(Number(limit))
        .skip(skip),
      Transaction.countDocuments(filter)
    ]);

    res.status(200).json({
      transactions,
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
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 * @access  Private (only buyer or seller)
 */
router.get('/:id', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyer', 'name email phone company currentProject')
      .populate('seller', 'name email phone company currentProject')
      .populate('material');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is buyer or seller
    const userId = req.user._id.toString();
    if (transaction.buyer._id.toString() !== userId && 
        transaction.seller._id.toString() !== userId &&
        req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only view your own transactions.' 
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction (purchase request)
 * @access  Private
 */
router.post('/', verifyToken, validateTransaction, async (req, res, next) => {
  try {
    const { materialId, quantity, notes } = req.body;
    const buyerId = req.user._id;

    // Get material
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if material is available
    if (material.status !== 'disponible') {
      return res.status(400).json({ 
        message: `Material is not available. Current status: ${material.status}` 
      });
    }

    // Check if quantity is available
    if (quantity > material.quantity) {
      return res.status(400).json({ 
        message: `Requested quantity (${quantity}) exceeds available quantity (${material.quantity})` 
      });
    }

    // Check if buyer is not the seller
    if (material.seller.toString() === buyerId.toString()) {
      return res.status(400).json({ 
        message: 'You cannot purchase your own material' 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      buyer: buyerId,
      seller: material.seller,
      material: materialId,
      quantity,
      unitPrice: material.price,
      totalPrice: quantity * material.price,
      buyerNotes: notes,
      status: 'pendiente'
    });

    // Update material status to reserved if full quantity is purchased
    if (quantity === material.quantity) {
      material.status = 'reservado';
      await material.save();
    }

    // Populate transaction
    await transaction.populate([
      { path: 'buyer', select: 'name email phone company' },
      { path: 'seller', select: 'name email phone company' },
      { path: 'material', select: 'title category images' }
    ]);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/transactions/:id/status
 * @desc    Update transaction status
 * @access  Private (only buyer or seller)
 */
router.patch('/:id/status', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const userId = req.user._id.toString();

    if (!['pendiente', 'confirmada', 'completada', 'cancelada'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const transaction = await Transaction.findById(req.params.id)
      .populate('material');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is buyer or seller
    const isBuyer = transaction.buyer.toString() === userId;
    const isSeller = transaction.seller.toString() === userId;

    if (!isBuyer && !isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Only buyer or seller can update transaction status.' 
      });
    }

    // Update transaction
    transaction.status = status;
    
    if (notes) {
      if (isBuyer) {
        transaction.buyerNotes = notes;
      } else if (isSeller) {
        transaction.sellerNotes = notes;
      }
    }

    await transaction.save();

    // Update material status based on transaction status
    const material = await Material.findById(transaction.material._id);
    
    if (status === 'confirmada') {
      // When seller accepts, material becomes reserved
      if (material.status === 'disponible') {
        material.status = 'reservado';
        await material.save();
      }
    } else if (status === 'completada') {
      // When transaction is completed, material is sold
      material.status = 'vendido';
      material.quantity -= transaction.quantity;
      if (material.quantity <= 0) {
        material.quantity = 0;
      }
      await material.save();
    } else if (status === 'cancelada') {
      // If transaction is cancelled, make material available again
      if (material.status === 'reservado' || material.status === 'vendido') {
        material.status = 'disponible';
        await material.save();
      }
    }

    await transaction.populate([
      { path: 'buyer', select: 'name email phone company' },
      { path: 'seller', select: 'name email phone company' },
      { path: 'material', select: 'title category images status' }
    ]);

    res.status(200).json({
      message: 'Transaction status updated successfully',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/transactions/:id/accept
 * @desc    Accept transaction (seller only)
 * @access  Private
 */
router.post('/:id/accept', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('material');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is the seller
    if (transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the seller can accept this transaction' 
      });
    }

    // Check if transaction is pending
    if (transaction.status !== 'pendiente') {
      return res.status(400).json({ 
        message: `Transaction is already ${transaction.status}` 
      });
    }

    // Get material and check availability
    const material = await Material.findById(transaction.material._id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if material has enough quantity
    if (material.quantity < transaction.quantity) {
      return res.status(400).json({ 
        message: `Insufficient quantity. Available: ${material.quantity}, Requested: ${transaction.quantity}` 
      });
    }

    // Update transaction status - directly to completed
    transaction.status = 'completada';
    await transaction.save();

    // Update material status - mark as sold
    material.status = 'vendido';
    material.quantity -= transaction.quantity;
    if (material.quantity <= 0) {
      material.quantity = 0;
    }
    await material.save();

    await transaction.populate([
      { path: 'buyer', select: 'name email phone company' },
      { path: 'seller', select: 'name email phone company' },
      { path: 'material', select: 'title category images status' }
    ]);

    res.status(200).json({
      message: 'Transaction accepted and completed successfully',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/transactions/:id/reject
 * @desc    Reject transaction (seller only)
 * @access  Private
 */
router.post('/:id/reject', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('material');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is the seller
    if (transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the seller can reject this transaction' 
      });
    }

    // Check if transaction is pending
    if (transaction.status !== 'pendiente') {
      return res.status(400).json({ 
        message: `Transaction is already ${transaction.status}` 
      });
    }

    // Update transaction status
    transaction.status = 'cancelada';
    await transaction.save();

    // Update material status - make it available again
    const material = await Material.findById(transaction.material._id);
    if (material.status === 'reservado') {
      material.status = 'disponible';
      await material.save();
    }

    await transaction.populate([
      { path: 'buyer', select: 'name email phone company' },
      { path: 'seller', select: 'name email phone company' },
      { path: 'material', select: 'title category images status' }
    ]);

    res.status(200).json({
      message: 'Transaction rejected. Material is now available again.',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/transactions/:id/complete
 * @desc    Complete transaction (seller only)
 * @access  Private
 */
router.post('/:id/complete', verifyToken, validateObjectId, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('material');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is the seller
    if (transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the seller can complete this transaction' 
      });
    }

    // Check if transaction is already completed
    if (transaction.status === 'completada') {
      return res.status(400).json({ 
        message: 'Transaction is already completed' 
      });
    }

    // Check if transaction is confirmed
    if (transaction.status !== 'confirmada') {
      return res.status(400).json({ 
        message: `Transaction must be confirmed before completing. Current status: ${transaction.status}` 
      });
    }

    // Update transaction status
    transaction.status = 'completada';
    await transaction.save();

    // Update material status - mark as sold
    const material = await Material.findById(transaction.material._id);
    material.status = 'vendido';
    material.quantity -= transaction.quantity;
    if (material.quantity <= 0) {
      material.quantity = 0;
    }
    await material.save();

    await transaction.populate([
      { path: 'buyer', select: 'name email phone company' },
      { path: 'seller', select: 'name email phone company' },
      { path: 'material', select: 'title category images status' }
    ]);

    res.status(200).json({
      message: 'Transaction completed successfully',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/transactions/stats/user
 * @desc    Get transaction statistics for logged-in user
 * @access  Private
 */
router.get('/stats/user', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [purchaseStats, saleStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { buyer: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalPrice' }
          }
        }
      ]),
      Transaction.aggregate([
        { $match: { seller: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalPrice' }
          }
        }
      ])
    ]);

    res.status(200).json({
      purchases: purchaseStats,
      sales: saleStats
    });
  } catch (error) {
    next(error);
  }
});

export default router;

