# 🚀 Guía de Deployment - ConstructMarket

Esta guía te ayudará a desplegar tu aplicación en producción.

## 📋 Opciones de Deployment

### Backend (Express + MongoDB)
- **Recomendado**: [Render](https://render.com) o [Railway](https://railway.app) (gratis)
- Alternativa: [Fly.io](https://fly.io) o [Heroku](https://heroku.com)

### Frontend (React + Vite)
- **Recomendado**: [Netlify](https://netlify.com) o [Vercel](https://vercel.com) (gratis)

---

## 🔧 Paso 1: Preparar el Backend

### 1.1 Crear archivo de configuración para Render/Railway

Si usas **Render**, crea `render.yaml` en la raíz del backend:

```yaml
services:
  - type: web
    name: construction-marketplace-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: TOKEN_SECRET
        sync: false
      - key: CLOUDINARY_NAME
        sync: false
      - key: CLOUDINARY_KEY
        sync: false
      - key: CLOUDINARY_SECRET
        sync: false
      - key: ORIGIN
        sync: false
```

### 1.2 Variables de Entorno en Producción

En tu plataforma de deployment (Render/Railway), configura estas variables:

```
NODE_ENV=production
PORT=10000 (o el que asigne la plataforma)
MONGODB_URI=tu-connection-string-de-mongodb-atlas
TOKEN_SECRET=tu-secreto-jwt-super-seguro-en-produccion
CLOUDINARY_NAME=tu-cloudinary-name
CLOUDINARY_KEY=tu-cloudinary-key
CLOUDINARY_SECRET=tu-cloudinary-secret
ORIGIN=https://tu-frontend-url.netlify.app
```

**⚠️ IMPORTANTE**: 
- Cambia `TOKEN_SECRET` por uno seguro y único
- `ORIGIN` debe ser la URL de tu frontend desplegado

---

## 🎨 Paso 2: Preparar el Frontend

### 2.1 Crear archivo `.env.production`

En `frontend/`, crea `.env.production`:

```env
VITE_API_URL=https://tu-backend-url.onrender.com/api
```

**⚠️ NO subas este archivo a Git** (ya está en .gitignore)

### 2.2 Actualizar `vite.config.js` para producción

Verifica que `vite.config.js` esté configurado correctamente:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

## 📦 Paso 3: Deployment en Render (Backend)

### 3.1 Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub
3. Conecta tu repositorio

### 3.2 Crear nuevo Web Service
1. Click en "New" → "Web Service"
2. Selecciona tu repositorio
3. Configura:
   - **Name**: `construction-marketplace-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.3 Configurar Variables de Entorno
En la sección "Environment", añade todas las variables mencionadas arriba.

### 3.4 Deploy
1. Click en "Create Web Service"
2. Espera a que termine el build
3. Copia la URL (ej: `https://construction-marketplace-api.onrender.com`)

---

## 🌐 Paso 4: Deployment en Netlify (Frontend)

### 4.1 Crear cuenta en Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Regístrate con GitHub
3. Conecta tu repositorio

### 4.2 Configurar Build Settings
1. Click en "Add new site" → "Import an existing project"
2. Selecciona tu repositorio
3. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4.3 Configurar Variables de Entorno
En "Site settings" → "Environment variables", añade:

```
VITE_API_URL=https://tu-backend-url.onrender.com/api
```

### 4.4 Deploy
1. Click en "Deploy site"
2. Espera a que termine el build
3. Copia la URL (ej: `https://constructmarket.netlify.app`)

### 4.5 Actualizar ORIGIN en Backend
Vuelve a Render y actualiza la variable `ORIGIN` con la URL de Netlify.

---

## 🔄 Paso 5: Verificar Deployment

### 5.1 Verificar Backend
- Visita: `https://tu-backend-url.onrender.com/api/health`
- Deberías ver: `{"status":"OK",...}`

### 5.2 Verificar Frontend
- Visita tu URL de Netlify
- Prueba registrarte y hacer login
- Verifica que las peticiones al backend funcionen

---

## 🐛 Troubleshooting

### Backend no inicia
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Render
- Asegúrate de que `MONGODB_URI` sea correcta

### CORS errors
- Verifica que `ORIGIN` en el backend sea la URL exacta del frontend
- Incluye `https://` en la URL

### Frontend no conecta con backend
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que el backend esté funcionando
- Revisa la consola del navegador para errores

---

## 📝 Checklist Final

- [ ] Backend desplegado en Render/Railway
- [ ] Variables de entorno configuradas en backend
- [ ] Frontend desplegado en Netlify/Vercel
- [ ] `VITE_API_URL` configurada en frontend
- [ ] `ORIGIN` actualizada en backend con URL del frontend
- [ ] MongoDB Atlas configurado y accesible
- [ ] Cloudinary configurado
- [ ] Aplicación funcionando en producción

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en producción. Comparte las URLs con tus usuarios.

**Backend**: `https://tu-backend-url.onrender.com`  
**Frontend**: `https://tu-frontend-url.netlify.app`

