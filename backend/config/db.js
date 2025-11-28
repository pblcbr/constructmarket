import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Debug: Check MONGODB_URI value (masked for security)
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set!');
      process.exit(1);
    }
    
    // Log first 20 chars to verify format
    const uriPreview = mongoUri.substring(0, 20);
    console.log(`🔍 MONGODB_URI preview: ${uriPreview}... (length: ${mongoUri.length})`);
    
    // Check if it starts with correct scheme
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.error(`❌ Invalid MONGODB_URI format. Must start with "mongodb://" or "mongodb+srv://"`);
      console.error(`   Current value starts with: "${uriPreview}"`);
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;

