# 🔐 Comandos Fly Secrets

Ejecuta estos comandos desde el directorio `backend/` para configurar las variables de entorno en Fly.io.

## 📋 Comandos (Copia y pega uno por uno)

```bash
# 1. Entorno
fly secrets set NODE_ENV=production

# 2. MongoDB Atlas (reemplaza con tu connection string)
fly secrets set MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/construction-marketplace?retryWrites=true&w=majority"

# 3. JWT Secret (genera uno seguro o usa el que ya tienes)
fly secrets set TOKEN_SECRET="tu-secreto-jwt-super-seguro-aqui-cambiar-en-produccion"

# 4. Cloudinary (reemplaza con tus credenciales)
fly secrets set CLOUDINARY_NAME="tu-cloudinary-cloud-name"
fly secrets set CLOUDINARY_KEY="tu-cloudinary-api-key"
fly secrets set CLOUDINARY_SECRET="tu-cloudinary-api-secret"

# 5. CORS Origin (actualiza esto DESPUÉS de desplegar el frontend)
fly secrets set ORIGIN="https://tu-frontend.netlify.app"
```

## ⚠️ IMPORTANTE

1. **MONGODB_URI**: 
   - Ve a MongoDB Atlas → Connect → Connect your application
   - Copia la connection string
   - Reemplaza `<password>` con tu contraseña
   - Asegúrate de que el cluster permita conexiones desde cualquier IP (0.0.0.0/0)

2. **TOKEN_SECRET**: 
   - Genera uno seguro: `openssl rand -base64 32`
   - O usa uno que ya tengas configurado

3. **CLOUDINARY**: 
   - Ve a tu dashboard de Cloudinary
   - Copia: Cloud name, API Key, API Secret

4. **ORIGIN**: 
   - Déjalo vacío por ahora o usa un placeholder
   - Lo actualizarás después de desplegar el frontend

## 🔍 Verificar Secrets

```bash
# Ver todos los secrets configurados
fly secrets list
```

## 📝 Ejemplo Completo

```bash
cd backend

fly secrets set NODE_ENV=production
fly secrets set MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/construction-marketplace?retryWrites=true&w=majority"
fly secrets set TOKEN_SECRET="mi-super-secreto-jwt-cambiar-en-produccion-123456789"
fly secrets set CLOUDINARY_NAME="dpwmj6ern"
fly secrets set CLOUDINARY_KEY="781531234567890"
fly secrets set CLOUDINARY_SECRET="5j7001234567890"
fly secrets set ORIGIN="https://constructmarket.netlify.app"
```

**⚠️ Reemplaza los valores de ejemplo con tus valores reales**

