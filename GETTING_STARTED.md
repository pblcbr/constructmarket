# Guía de Inicio Rápido - Construction Marketplace

## 🚀 Instrucciones para Empezar

### 1. Preparación Inicial

Asegúrate de tener instalado:
- Node.js (v16 o superior)
- MongoDB (local o cuenta en MongoDB Atlas)
- Git

### 2. Configurar el Backend

```bash
# Abrir una terminal y navegar al directorio backend
cd /Users/pblcbr/IronHack/Final_project/backend

# Instalar dependencias
npm install

# Crear archivo .env con las configuraciones
cat > .env << 'EOF'
PORT=5005
MONGODB_URI=mongodb://127.0.0.1:27017/construction-marketplace
TOKEN_SECRET=mi-super-secreto-para-jwt-cambiar-en-produccion
ORIGIN=http://localhost:5173
EOF

# Iniciar MongoDB (si es local)
# En Mac con Homebrew:
brew services start mongodb-community

# Iniciar el servidor backend
npm run dev
```

El backend estará corriendo en `http://localhost:5005`

### 3. Configurar el Frontend

```bash
# Abrir OTRA terminal y navegar al directorio frontend
cd /Users/pblcbr/IronHack/Final_project/frontend

# Instalar dependencias
npm install

# Iniciar el servidor frontend
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

### 4. Probar la Aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Haz clic en "Registrarse"
3. Crea una cuenta de usuario
4. Explora el marketplace
5. Publica un material
6. Crea otra cuenta (en modo incógnito o otro navegador)
7. Compra el material publicado
8. Revisa las transacciones

## 📝 Comandos Útiles

### Backend
```bash
cd backend
npm run dev          # Modo desarrollo con nodemon
npm start           # Modo producción
```

### Frontend
```bash
cd frontend
npm run dev         # Modo desarrollo
npm run build       # Build para producción
npm run preview     # Preview del build
```

## 🗄️ Datos de Prueba

### Usuario de prueba 1 (Vendedor)
```
Email: jefe1@construcciones.com
Password: 123456
Nombre: Juan Pérez
Empresa: Construcciones ABC
Proyecto: Edificio Residencial Norte
```

### Usuario de prueba 2 (Comprador)
```
Email: jefe2@construcciones.com
Password: 123456
Nombre: María García
Empresa: Construcciones XYZ
Proyecto: Centro Comercial Sur
```

### Material de ejemplo
```
Título: Vallas metálicas de obra
Descripción: 10 vallas metálicas en buen estado, usadas durante 6 meses
Categoría: Vallas
Cantidad: 10
Unidad: Unidades
Precio: 45€ por unidad
Condición: Buen Estado
Ubicación: Madrid, Polígono Industrial
```

## 🔧 Solución de Problemas

### Error: ECONNREFUSED MongoDB
```bash
# Iniciar MongoDB
brew services start mongodb-community

# O si usas mongod directamente:
mongod --dbpath /usr/local/var/mongodb
```

### Error: Puerto 5005 en uso
```bash
# Encontrar y matar el proceso
lsof -ti:5005 | xargs kill -9

# O cambiar el puerto en .env
PORT=5006
```

### Error: CORS
- Verifica que el backend tenga configurado ORIGIN=http://localhost:5173
- Reinicia el servidor backend

### Error: Token inválido
- Cierra sesión y vuelve a iniciar
- Limpia localStorage del navegador (F12 > Application > Local Storage)

## 📦 Estructura de Commits para GitHub

```bash
# Inicializar repos (si no lo has hecho)
cd backend
git init
git add .
git commit -m "Initial commit: Backend setup with Express, MongoDB, and JWT authentication"

cd ../frontend
git init
git add .
git commit -m "Initial commit: Frontend setup with React, Vite, and Tailwind CSS"
```

## 🌐 Despliegue Rápido

### Opción 1: Fly.io (Backend)
```bash
cd backend
fly launch
fly secrets set TOKEN_SECRET=your-secret
fly secrets set MONGODB_URI=your-mongodb-atlas-uri
fly deploy
```

### Opción 2: Netlify (Frontend)
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

## ✅ Checklist Pre-Entrega

- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Todas las rutas funcionando
- [ ] Autenticación funcionando
- [ ] CRUD de materiales completo
- [ ] Sistema de transacciones operativo
- [ ] README completo en ambos repos
- [ ] Código limpio y comentado
- [ ] .gitignore configurado
- [ ] Variables de entorno en .env.example
- [ ] Al menos 2 commits por día trabajado
- [ ] Aplicación desplegada online
- [ ] Presentación preparada

## 🎯 Próximos Pasos

1. **Testing**: Prueba todas las funcionalidades
2. **Refactoring**: Revisa y mejora el código
3. **Documentación**: Completa comentarios y README
4. **Despliegue**: Sube a Fly.io y Netlify
5. **GitHub**: Sube ambos repositorios
6. **Presentación**: Prepara slides

¡Buena suerte con tu proyecto final! 🚀

