# Guía de Git y GitHub

## 📦 Crear los Repositorios en GitHub

### Paso 1: Crear Repositorios en GitHub

1. Ve a https://github.com/new
2. Crea el primer repositorio:
   - **Nombre**: `construction-marketplace-backend`
   - **Descripción**: Backend REST API for Construction Materials Marketplace
   - **Visibilidad**: Public
   - **NO** inicialices con README, .gitignore, o license
   - Clic en "Create repository"

3. Crea el segundo repositorio:
   - **Nombre**: `construction-marketplace-frontend`
   - **Descripción**: Frontend SPA for Construction Materials Marketplace  
   - **Visibilidad**: Public
   - **NO** inicialices con README, .gitignore, o license
   - Clic en "Create repository"

### Paso 2: Configurar Git Local (Backend)

```bash
cd /Users/pblcbr/IronHack/Final_project/backend

# Inicializar repositorio Git
git init

# Configurar usuario (si no lo has hecho)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Añadir todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Backend setup with Express, MongoDB, and JWT authentication

- Express.js REST API
- MongoDB with Mongoose ODM
- JWT authentication with bcrypt
- User, Material, and Transaction models
- CRUD operations for all models
- Input validation with express-validator
- Centralized error handling
- Protected routes with authorization middleware"

# Conectar con GitHub (reemplaza 'usuario' con tu usuario de GitHub)
git remote add origin https://github.com/usuario/construction-marketplace-backend.git

# Crear rama main
git branch -M main

# Push inicial
git push -u origin main
```

### Paso 3: Configurar Git Local (Frontend)

```bash
cd /Users/pblcbr/IronHack/Final_project/frontend

# Inicializar repositorio Git
git init

# Configurar usuario (si no lo has hecho)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Añadir todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Frontend setup with React, Vite, and Tailwind CSS

- React 18 SPA with Vite
- React Router DOM for navigation
- Context API for state management (Auth)
- Tailwind CSS for styling
- Axios for API communication
- Multiple pages and components
- CRUD operations for materials
- Transaction management system
- User authentication and protected routes
- Responsive design (mobile-first)"

# Conectar con GitHub (reemplaza 'usuario' con tu usuario de GitHub)
git remote add origin https://github.com/usuario/construction-marketplace-frontend.git

# Crear rama main
git branch -M main

# Push inicial
git push -u origin main
```

## 📝 Guía de Commits Diarios

### Estructura de Commits

Usa mensajes descriptivos que expliquen QUÉ y POR QUÉ:

```bash
# ❌ Mal
git commit -m "fix"
git commit -m "update"

# ✅ Bien
git commit -m "Add validation to material creation form"
git commit -m "Fix authentication token expiration issue"
git commit -m "Implement transaction status update feature"
```

### Ejemplos de Commits por Día

**Día 1: Setup inicial**
```bash
git commit -m "Initial project setup with Express and MongoDB"
git commit -m "Configure environment variables and database connection"
git commit -m "Create User model with password hashing"
```

**Día 2: Autenticación**
```bash
git commit -m "Implement JWT authentication middleware"
git commit -m "Add signup and login routes with validation"
git commit -m "Create auth context in frontend"
```

**Día 3: Modelos y CRUD**
```bash
git commit -m "Create Material model with validation"
git commit -m "Implement CRUD routes for materials"
git commit -m "Add material creation page in frontend"
```

**Día 4: Marketplace**
```bash
git commit -m "Add filtering and pagination to materials API"
git commit -m "Create marketplace page with search functionality"
git commit -m "Implement MaterialCard component"
```

**Día 5: Transacciones**
```bash
git commit -m "Create Transaction model and routes"
git commit -m "Add purchase flow in material detail page"
git commit -m "Implement transactions page to view orders"
```

**Día 6: Perfiles y mejoras**
```bash
git commit -m "Add user profile management"
git commit -m "Improve error handling and validation"
git commit -m "Add loading states to all pages"
```

**Día 7: UI/UX y testing**
```bash
git commit -m "Improve responsive design for mobile devices"
git commit -m "Add success and error message components"
git commit -m "Fix navigation issues in private routes"
```

**Día 8: Deployment**
```bash
git commit -m "Configure environment variables for production"
git commit -m "Update README with deployment instructions"
git commit -m "Add CORS configuration for deployed frontend"
```

## 🌿 Trabajar con Ramas (Opcional pero Recomendado)

### Crear rama para nueva feature

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/material-images

# Hacer cambios...
git add .
git commit -m "Add image upload functionality for materials"

# Volver a main
git checkout main

# Mergear la feature
git merge feature/material-images

# Eliminar rama (opcional)
git branch -d feature/material-images

# Push a GitHub
git push origin main
```

### Estructura de ramas recomendada

- `main` - Código de producción estable
- `develop` - Rama de desarrollo
- `feature/nombre` - Nuevas funcionalidades
- `fix/nombre` - Correcciones de bugs

## 🚀 Flujo de Trabajo Diario

### Inicio del día
```bash
# Asegurarse de estar en la rama correcta
git status

# Actualizar desde GitHub (si trabajas en varios dispositivos)
git pull origin main
```

### Durante el desarrollo
```bash
# Ver estado de los cambios
git status

# Ver diferencias específicas
git diff

# Añadir archivos específicos
git add src/pages/MaterialDetailPage.jsx

# O añadir todo
git add .

# Commit con mensaje descriptivo
git commit -m "Add purchase modal to material detail page"
```

### Final del día
```bash
# Verificar que todo está commiteado
git status

# Push a GitHub
git push origin main
```

## 📊 Ver Historial

```bash
# Ver log de commits
git log

# Ver log resumido
git log --oneline

# Ver log con gráfico de ramas
git log --graph --oneline --all

# Ver cambios de un commit específico
git show commit-hash
```

## ⚠️ Comandos Útiles

### Deshacer cambios

```bash
# Descartar cambios en un archivo (antes de add)
git checkout -- archivo.js

# Deshacer git add (mantiene cambios)
git reset HEAD archivo.js

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Ver archivos ignorados
git status --ignored
```

### Stash (guardar cambios temporalmente)

```bash
# Guardar cambios sin commit
git stash

# Ver stashes guardados
git stash list

# Recuperar último stash
git stash pop
```

## 📋 Checklist Pre-Push

Antes de hacer push, verifica:

- [ ] Código funciona correctamente
- [ ] No hay errores en consola
- [ ] Archivos sensibles en .gitignore
- [ ] .env NO está en el repo (debe estar en .gitignore)
- [ ] Mensaje de commit descriptivo
- [ ] README actualizado si es necesario
- [ ] No hay archivos node_modules en el repo

## 🎯 Tips para Buenos Commits

1. **Commits atómicos**: Un commit = un cambio lógico
2. **Mensajes descriptivos**: Explica QUÉ y POR QUÉ
3. **Commits frecuentes**: No esperes a tener todo perfecto
4. **Mínimo 2 commits por día** trabajado (requisito del proyecto)
5. **Usa branches** para features grandes

## 📚 Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Recuerda**: El historial de Git es importante para la evaluación del proyecto. Demuestra tu proceso de desarrollo con commits regulares y descriptivos.

