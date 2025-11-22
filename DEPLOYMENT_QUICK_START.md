# 🚀 Quick Start - Deployment Rápido

## Opción 1: Render + Netlify (Recomendado - Más Fácil)

**Render** es más fácil de usar (todo desde la web, sin CLI).

## Opción 2: Fly.io + Netlify (Alternativa - Más Potente)

**Fly.io** es más potente y rápido, pero requiere instalar CLI. Ver `DEPLOYMENT_FLYIO.md` para instrucciones.

---

## Opción 1: Render + Netlify (Recomendado - Más Fácil)

### Backend en Render (5 minutos)

1. **Ve a [render.com](https://render.com)** y regístrate con GitHub

2. **Crea un nuevo Web Service**:
   - Click "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Name**: `construction-marketplace-api`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Añade estas Variables de Entorno** (en "Environment"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=tu-connection-string-de-mongodb-atlas
   TOKEN_SECRET=tu-secreto-super-seguro-aqui
   CLOUDINARY_NAME=tu-cloudinary-name
   CLOUDINARY_KEY=tu-cloudinary-key
   CLOUDINARY_SECRET=tu-cloudinary-secret
   ORIGIN=https://tu-frontend.netlify.app
   ```
   ⚠️ **IMPORTANTE**: Deja `ORIGIN` vacío por ahora, lo actualizarás después

4. **Click "Create Web Service"** y espera el deploy
5. **Copia la URL** (ej: `https://construction-marketplace-api.onrender.com`)

---

### Frontend en Netlify (5 minutos)

1. **Ve a [netlify.com](https://netlify.com)** y regístrate con GitHub

2. **Crea un nuevo sitio**:
   - Click "Add new site" → "Import an existing project"
   - Selecciona tu repositorio
   - Configura:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Añade Variable de Entorno** (en "Site settings" → "Environment variables"):
   ```
   VITE_API_URL=https://tu-backend-url.onrender.com/api
   ```
   (Usa la URL que copiaste del backend)

4. **Click "Deploy site"** y espera el build
5. **Copia la URL** (ej: `https://constructmarket.netlify.app`)

---

### Actualizar ORIGIN en Backend

1. Vuelve a Render
2. Ve a "Environment" de tu servicio
3. Actualiza `ORIGIN` con la URL de Netlify:
   ```
   ORIGIN=https://constructmarket.netlify.app
   ```
4. Guarda y espera a que se reinicie

---

## ✅ Verificar

1. **Backend**: Visita `https://tu-backend.onrender.com/api/health`
   - Deberías ver: `{"status":"OK",...}`

2. **Frontend**: Visita tu URL de Netlify
   - Prueba registrarte y hacer login
   - Todo debería funcionar

---

## 🎉 ¡Listo!

Tu app está en producción. Comparte la URL de Netlify con tus usuarios.

---

## 📝 Notas Importantes

- **MongoDB Atlas**: Asegúrate de que tu cluster permita conexiones desde cualquier IP (0.0.0.0/0) en "Network Access"
- **Cloudinary**: Ya deberías tener las credenciales configuradas
- **TOKEN_SECRET**: Usa un string largo y aleatorio (puedes generarlo con: `openssl rand -base64 32`)

---

## 🆘 Si algo falla

1. Revisa los logs en Render (pestaña "Logs")
2. Revisa los logs en Netlify (pestaña "Deploys" → click en el deploy → "Deploy log")
3. Abre la consola del navegador (F12) para ver errores
4. Verifica que todas las variables de entorno estén configuradas

