# Construction Materials Marketplace

**Marketplace B2B interno para compra y venta de materiales de construcción sobrantes entre jefes de obra.**

Este proyecto consiste en una plataforma web completa (MERN Stack) que permite a los jefes de obra de una empresa de construcción vender materiales sobrantes de sus obras y comprar materiales de segunda mano de otros proyectos, optimizando recursos y reduciendo costes.

## 📌 Descripción del Proyecto

### Problema
Las empresas de construcción generan materiales sobrantes al finalizar obras (vallas, conos, palets, andamios, herramientas, etc.) que actualmente se venden externamente perdiendo margen de beneficio.

### Solución
Un marketplace interno donde:
- Los jefes de obra pueden **vender** sus materiales sobrantes, contabilizándolos como ingresos adicionales
- Otros jefes de obra pueden **comprar** estos materiales a precios reducidos, ahorrando en costes
- La empresa optimiza recursos y promueve la sostenibilidad

## 🚀 Características Principales

### Backend (REST API)
- ✅ Express.js + MongoDB + Mongoose
- ✅ 3 modelos de base de datos: User, Material, Transaction
- ✅ CRUD completo para todos los modelos
- ✅ Autenticación JWT con contraseñas encriptadas (bcrypt)
- ✅ Autorización (rutas protegidas)
- ✅ Validación de datos con express-validator
- ✅ Manejo centralizado de errores
- ✅ Middleware de autenticación y autorización

### Frontend (SPA)
- ✅ React 18 con Vite
- ✅ React Router DOM para navegación
- ✅ Context API para gestión de estado
- ✅ Tailwind CSS para estilos
- ✅ Múltiples vistas y componentes reutilizables
- ✅ CRUD completo desde la interfaz
- ✅ Sistema de autenticación completo
- ✅ Rutas protegidas
- ✅ Diseño responsive (mobile-first)
- ✅ Filtros y búsqueda avanzada

## 🗂️ Estructura del Proyecto

```
Final_project/
├── backend/                # API REST con Express
│   ├── config/            # Configuración de DB
│   ├── middleware/        # Auth, validación, errores
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas de la API
│   ├── .env.example       # Variables de entorno
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js          # Punto de entrada
│
└── frontend/              # SPA con React
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Context API (Auth)
    │   ├── hooks/         # Custom hooks
    │   ├── pages/         # Vistas/páginas
    │   ├── services/      # API service layer
    │   ├── App.jsx
    │   ├── index.css      # Tailwind CSS
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── README.md
    ├── tailwind.config.js
    └── vite.config.js
```

## 📦 Modelos de Base de Datos

### User (Usuario/Jefe de Obra)
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  company: String,
  currentProject: String,
  role: String (user/admin),
  isActive: Boolean
}
```

### Material
```javascript
{
  title: String,
  description: String,
  category: String (enum),
  quantity: Number,
  unit: String (enum),
  price: Number,
  condition: String (enum),
  location: String,
  projectName: String,
  images: [String],
  seller: ObjectId (ref: User),
  status: String (disponible/reservado/vendido),
  featured: Boolean
}
```

### Transaction (Compra/Venta)
```javascript
{
  buyer: ObjectId (ref: User),
  seller: ObjectId (ref: User),
  material: ObjectId (ref: Material),
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number,
  status: String (pendiente/confirmada/completada/cancelada),
  deliveryDate: Date,
  notes: String,
  buyerNotes: String,
  sellerNotes: String
}
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- Git

### Backend Setup

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:5005`

### Frontend Setup

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/verify` - Verificar token

### Materials
- `GET /api/materials` - Listar materiales (con filtros)
- `GET /api/materials/:id` - Obtener material por ID
- `POST /api/materials` - Crear material (auth)
- `PUT /api/materials/:id` - Actualizar material (auth, owner)
- `PATCH /api/materials/:id/status` - Actualizar estado
- `DELETE /api/materials/:id` - Eliminar material (auth, owner)
- `GET /api/materials/seller/:sellerId` - Materiales por vendedor

### Transactions
- `GET /api/transactions` - Listar transacciones del usuario (auth)
- `GET /api/transactions/:id` - Obtener transacción (auth)
- `POST /api/transactions` - Crear transacción (auth)
- `PATCH /api/transactions/:id/status` - Actualizar estado (auth)
- `GET /api/transactions/stats/user` - Estadísticas (auth)

### Users
- `GET /api/users/profile` - Perfil del usuario (auth)
- `PUT /api/users/profile` - Actualizar perfil (auth)
- `PUT /api/users/password` - Cambiar contraseña (auth)
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID (auth)
- `DELETE /api/users/:id` - Eliminar usuario (admin)

## 🎨 Tecnologías Utilizadas

### Backend
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **express-validator** - Validación de datos
- **cors** - CORS middleware
- **dotenv** - Variables de entorno
- **morgan** - Logger HTTP

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **Context API** - Gestión de estado

## 🌐 Despliegue

### Backend (Fly.io)

```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Lanzar aplicación
cd backend
fly launch

# Configurar secrets
fly secrets set TOKEN_SECRET=your-secret
fly secrets set MONGODB_URI=your-mongodb-uri

# Desplegar
fly deploy
```

### Frontend (Netlify)

```bash
# Build
cd frontend
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod --dir=dist
```

## 📋 Requisitos del Proyecto (Checklist)

### Técnicos
- ✅ SPA con React
- ✅ Múltiples vistas con CRUD completo
- ✅ REST API con Express + MongoDB + Mongoose
- ✅ CRUD para al menos un modelo (además de User)
- ✅ 3 modelos o más (User, Material, Transaction)
- ✅ Autenticación completa (signup, login, logout)
- ✅ Contraseñas encriptadas
- ✅ Autorización (rutas protegidas)
- ✅ 2 repositorios separados en GitHub
- ✅ Validación backend y manejo de errores centralizado
- ✅ Código limpio y modular
- ✅ README completo en ambos repositorios

### Funcionales
- ✅ Sistema de autenticación robusto
- ✅ Marketplace con filtros avanzados
- ✅ Gestión completa de materiales (CRUD)
- ✅ Sistema de transacciones/órdenes
- ✅ Gestión de perfil de usuario
- ✅ Diseño responsive
- ✅ Manejo de errores y validación
- ✅ Estados de carga
- ✅ Componentes reutilizables

## 🧪 Testing

### Backend
Testear la API usando:
- Postman
- Insomnia
- Thunder Client

### Frontend
```bash
# Ejecutar en modo desarrollo
npm run dev

# Build de producción
npm run build
npm run preview
```

## 📝 Convenciones de Código

- **Nombres de variables**: camelCase descriptivo
- **Componentes React**: PascalCase
- **Archivos**: kebab-case para directorios, PascalCase para componentes
- **Funciones**: Nombres con verbos (get, create, update, delete)
- **Comentarios**: JSDoc para funciones principales
- **Commits**: Mensajes descriptivos en español

## 🤝 Contribuciones

Este es un proyecto educativo para el programa de Master de IronHack.

## 👥 Autor

**Nombre del Estudiante**
- GitHub: [@usuario](https://github.com/usuario)
- Email: email@ejemplo.com

## 📄 Licencia

ISC

---

## 🎓 Notas del Proyecto Final

### Presentación
- Duración: 10 minutos
- Demo en vivo de la aplicación
- Explicación de arquitectura y decisiones técnicas
- Mostrar código destacable
- Mencionar desafíos y aprendizajes

### URLs del Proyecto
- **Backend Repo**: `https://github.com/usuario/construction-marketplace-backend`
- **Frontend Repo**: `https://github.com/usuario/construction-marketplace-frontend`
- **Backend Desplegado**: `https://your-app.fly.dev`
- **Frontend Desplegado**: `https://your-app.netlify.app`
- **Presentación**: `https://slides.com/...`

---

**¡Gracias por revisar este proyecto!** 🚀

