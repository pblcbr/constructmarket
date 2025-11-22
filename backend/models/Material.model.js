import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['vallas', 'conos', 'palets', 'andamios', 'herramientas', 'maquinaria', 'materiales-construccion', 'señalizacion', 'proteccion', 'otros'],
        message: '{VALUE} is not a valid category'
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['unidades', 'metros', 'kg', 'cajas', 'palets', 'lotes'],
      default: 'unidades'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['nuevo', 'como-nuevo', 'buen-estado', 'usado', 'necesita-reparacion'],
        message: '{VALUE} is not a valid condition'
      }
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    projectName: {
      type: String,
      trim: true,
      default: ''
    },
    images: [{
      type: String,
      trim: true
    }],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required']
    },
    status: {
      type: String,
      enum: ['disponible', 'reservado', 'vendido'],
      default: 'disponible'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for better search performance
materialSchema.index({ title: 'text', description: 'text' });
materialSchema.index({ category: 1, status: 1 });
materialSchema.index({ seller: 1 });
materialSchema.index({ createdAt: -1 });

const Material = mongoose.model('Material', materialSchema);

export default Material;

