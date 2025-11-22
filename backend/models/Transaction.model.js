import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required']
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required']
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: [true, 'Material is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['pendiente', 'confirmada', 'completada', 'cancelada'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pendiente'
    },
    deliveryDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    buyerNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Buyer notes cannot exceed 500 characters']
    },
    sellerNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Seller notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, createdAt: -1 });
transactionSchema.index({ material: 1 });
transactionSchema.index({ status: 1 });

// Calculate total price before saving
transactionSchema.pre('save', function (next) {
  if (this.isModified('quantity') || this.isModified('unitPrice')) {
    this.totalPrice = this.quantity * this.unitPrice;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

