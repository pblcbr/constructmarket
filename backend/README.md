# Construction Materials Marketplace - Backend

Backend REST API for the Construction Materials Marketplace application. This API enables construction site managers to buy and sell surplus construction materials.

## 🚀 Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📋 Features

- ✅ User authentication (signup, login, JWT)
- ✅ CRUD operations for Materials
- ✅ CRUD operations for Transactions
- ✅ User profile management
- ✅ Advanced filtering and pagination
- ✅ Centralized error handling
- ✅ Input validation and sanitization
- ✅ Role-based authorization

## 🗃️ Database Models

### User
- Email, password (hashed), name, phone
- Company, current project
- Role (user/admin)

### Material
- Title, description, category
- Quantity, unit, price
- Condition, location, project name
- Images, seller reference
- Status (disponible/reservado/vendido)

### Transaction
- Buyer, seller, material references
- Quantity, unit price, total price
- Status (pendiente/confirmada/completada/cancelada)
- Notes from buyer and seller

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5005
MONGODB_URI=mongodb://127.0.0.1:27017/construction-marketplace
TOKEN_SECRET=your-super-secret-token-key
ORIGIN=http://localhost:5173
```

5. Start MongoDB locally or use MongoDB Atlas

6. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /verify` - Verify JWT token

### Materials (`/api/materials`)
- `GET /` - Get all materials (with filters)
- `GET /:id` - Get material by ID
- `POST /` - Create material (auth required)
- `PUT /:id` - Update material (auth required, owner only)
- `PATCH /:id/status` - Update material status
- `DELETE /:id` - Delete material (auth required, owner only)
- `GET /seller/:sellerId` - Get materials by seller

### Transactions (`/api/transactions`)
- `GET /` - Get user transactions (auth required)
- `GET /:id` - Get transaction by ID (auth required)
- `POST /` - Create transaction (auth required)
- `PATCH /:id/status` - Update transaction status (auth required)
- `GET /stats/user` - Get user statistics (auth required)

### Users (`/api/users`)
- `GET /profile` - Get current user profile (auth required)
- `PUT /profile` - Update profile (auth required)
- `PUT /password` - Update password (auth required)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID (auth required)
- `DELETE /:id` - Delete user (admin only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## 📦 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Centralized error handling
│   └── validation.js      # Input validation rules
├── models/
│   ├── User.model.js      # User schema
│   ├── Material.model.js  # Material schema
│   └── Transaction.model.js # Transaction schema
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   ├── material.routes.js # Material routes
│   ├── transaction.routes.js # Transaction routes
│   └── user.routes.js     # User routes
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

## 🚀 Deployment

### Fly.io Deployment

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly:
```bash
fly auth login
```

3. Launch the app:
```bash
fly launch
```

4. Set environment variables:
```bash
fly secrets set TOKEN_SECRET=your-secret
fly secrets set MONGODB_URI=your-mongodb-uri
```

5. Deploy:
```bash
fly deploy
```

## 📝 Notes

- All passwords are hashed using bcryptjs before storing
- JWT tokens expire after 7 days
- Input validation is performed on all routes
- Comprehensive error messages for debugging
- CORS enabled for frontend communication

## 👥 Author

Created as a final project for IronHack Master Program

## 📄 License

ISC

