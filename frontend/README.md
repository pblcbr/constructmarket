# Construction Materials Marketplace - Frontend

Frontend SPA (Single Page Application) for the Construction Materials Marketplace. Built with React, this application enables construction site managers to buy and sell surplus construction materials through an intuitive and modern interface.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

## 📋 Features

- ✅ User authentication (signup, login, logout)
- ✅ Protected routes for authenticated users
- ✅ Marketplace with advanced filtering and search
- ✅ Material CRUD operations (Create, Read, Update, Delete)
- ✅ Transaction/Order management
- ✅ User profile management
- ✅ Responsive design (mobile-first approach)
- ✅ Modern and intuitive UI/UX
- ✅ Real-time form validation
- ✅ Loading states and error handling

## 🗂️ Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx       # Error display component
│   │   ├── Footer.jsx              # App footer
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   ├── MaterialCard.jsx        # Material card component
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── PrivateRoute.jsx        # Protected route wrapper
│   │   └── SuccessMessage.jsx      # Success message display
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── hooks/
│   │   └── useAuth.js              # Auth hook
│   ├── pages/
│   │   ├── CreateMaterialPage.jsx  # Create new material
│   │   ├── EditMaterialPage.jsx    # Edit existing material
│   │   ├── HomePage.jsx            # Landing page
│   │   ├── LoginPage.jsx           # Login page
│   │   ├── MarketplacePage.jsx     # Browse all materials
│   │   ├── MaterialDetailPage.jsx  # Material details
│   │   ├── MyMaterialsPage.jsx     # User's published materials
│   │   ├── NotFoundPage.jsx        # 404 page
│   │   ├── ProfilePage.jsx         # User profile
│   │   ├── SignupPage.jsx          # Registration page
│   │   └── TransactionsPage.jsx    # User transactions
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Global styles (Tailwind)
│   └── main.jsx                    # App entry point
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
VITE_API_URL=http://localhost:5005/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue shades (from Tailwind's `sky` colors)
- **Construction Orange**: `#ff6b35` - Used for prices and CTAs
- **Construction Yellow**: `#f7931e` - Accent color
- **Gray**: Various shades for text and backgrounds

### Components

The app uses reusable components with consistent styling:

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- **Inputs**: `.input` class for all form inputs
- **Cards**: `.card` class for content cards
- **Badges**: `.badge`, `.badge-disponible`, `.badge-reservado`, etc.

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token is stored in `localStorage`
3. Token is automatically attached to all API requests
4. AuthContext provides authentication state throughout the app
5. Private routes check authentication status
6. Token expiry automatically logs user out

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with features and benefits
- **Marketplace** (`/marketplace`) - Browse and search materials
- **Material Detail** (`/materials/:id`) - View material details
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration

### Private Pages (Authentication Required)
- **Create Material** (`/materials/create`) - Publish new material
- **Edit Material** (`/materials/edit/:id`) - Edit published material
- **My Materials** (`/my-materials`) - View user's materials
- **Transactions** (`/transactions`) - View purchases and sales
- **Profile** (`/profile`) - User profile management

## 🌐 API Integration

The app communicates with the backend REST API through the `api.js` service layer:

- **Authentication**: Login, signup, token verification
- **Materials**: CRUD operations, search, filter
- **Transactions**: Create, view, update status
- **Users**: Profile management

All requests include:
- JWT token in Authorization header (if logged in)
- Automatic error handling
- Response interceptors for global error management

## 🎯 Key Features Explained

### Material Filtering
Users can filter materials by:
- Search text (title and description)
- Category
- Condition
- Price range

### Transaction Flow
1. Buyer views material details
2. Clicks "Solicitar Compra"
3. Enters quantity and notes
4. Transaction is created with status "pendiente"
5. Seller can see the transaction
6. Both parties can update transaction status

### Responsive Design
- Mobile-first approach
- Hamburger menu on small screens
- Responsive grid layouts
- Touch-friendly UI elements

## 🚀 Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. The `dist/` folder contains the production build

3. Deploy to Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

4. Configure environment variables in Netlify dashboard:
- `VITE_API_URL` - Your backend API URL

### Important Notes for Deployment

- Set correct API URL in environment variables
- Ensure backend API has proper CORS configuration
- Configure `_redirects` file for SPA routing if needed

## 🧪 Testing Locally

1. Start the backend server (port 5005)
2. Start the frontend dev server (port 5173)
3. Test the full flow:
   - Register a new user
   - Publish a material
   - Browse marketplace
   - Purchase a material (with another user)
   - View transactions

## 📝 Code Style

- Functional components with hooks
- Descriptive variable names
- One component per file
- Comments for complex logic
- Consistent formatting

## 🔧 Troubleshooting

### CORS Errors
- Ensure backend has correct CORS configuration
- Check `ORIGIN` environment variable in backend

### Authentication Issues
- Clear localStorage and login again
- Check token expiration in backend

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 👥 Author

Created as a final project for IronHack Master Program

## 📄 License

ISC

---

## 🎓 Project Requirements Checklist

✅ SPA with React
✅ Multiple views with routing
✅ CRUD operations for materials
✅ Authentication (signup, login, logout)
✅ Protected routes
✅ Integration with REST API
✅ State management (Context API)
✅ Responsive design with Tailwind CSS
✅ Error handling
✅ Loading states
✅ Form validation
✅ Clean and modular code

