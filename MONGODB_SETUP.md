# Guía Completa: Configurar MongoDB Atlas

## 📋 Paso a Paso - MongoDB Atlas

### Paso 1: Crear Cuenta
1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Regístrate con email o Google
3. Completa el formulario

### Paso 2: Crear Cluster
1. Selecciona:
   - **Cloud Provider**: AWS
   - **Region**: eu-west-1 (Ireland) - más cercano a España
   - **Cluster Tier**: M0 Sandbox (FREE)
   - **Name**: construction-marketplace
2. Clic en "Create"

### Paso 3: Configurar Seguridad

#### Crear Usuario
1. Username: `admin`
2. Password: Copia la que generen o usa: `Admin123456!`
3. **¡GUARDA ESTA PASSWORD!**

#### Configurar Red
1. Add IP Address: `0.0.0.0/0` (permite todo para desarrollo)
2. Description: "Allow all IPs"

### Paso 4: Obtener Connection String
1. Clic en "Connect" en tu cluster
2. Elige "Connect your application"
3. Copia la URL que se ve así:

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Paso 5: Crear archivo .env

**EN TU TERMINAL**, ejecuta estos comandos:

```bash
cd /Users/pblcbr/IronHack/Final_project/backend

# Crear el archivo .env
cat > .env << 'EOF'
PORT=5005
MONGODB_URI=AQUI_PEGA_TU_CONNECTION_STRING
TOKEN_SECRET=mi-super-secreto-jwt-para-construccion-marketplace-2024
ORIGIN=http://localhost:5173
EOF
```

### Paso 6: Editar el archivo .env

Abre el archivo `.env` que acabas de crear y:

1. **Reemplaza** `AQUI_PEGA_TU_CONNECTION_STRING` con tu URL de Atlas
2. **Importante**: En la URL, reemplaza `<password>` con tu contraseña real
3. **Añade** `/construction-marketplace` antes del `?` para especificar el nombre de la BD

**Ejemplo final:**
```
PORT=5005
MONGODB_URI=mongodb+srv://admin:Admin123456!@cluster0.abc123.mongodb.net/construction-marketplace?retryWrites=true&w=majority
TOKEN_SECRET=mi-super-secreto-jwt-para-construccion-marketplace-2024
ORIGIN=http://localhost:5173
```

## 🔍 Verificar la Configuración

### Verificar que .env existe:
```bash
cd backend
cat .env
```

Deberías ver tu configuración (sin mostrar aquí para seguridad).

### Verificar que .env está en .gitignore:
```bash
cat .gitignore | grep .env
```

Debe aparecer `.env` en la lista.

## ✅ ¡Listo para Probar!

Ahora puedes instalar las dependencias e iniciar el backend:

```bash
# Asegúrate de estar en el directorio backend
cd /Users/pblcbr/IronHack/Final_project/backend

# Instalar dependencias
npm install

# Iniciar el servidor
npm run dev
```

Si todo está bien, verás:
```
🚀 Server running on port 5005
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📦 Database: construction-marketplace
```

## 🆘 Troubleshooting

### Error: "MongoServerError: bad auth"
- Verifica que la contraseña en MONGODB_URI sea correcta
- Asegúrate de NO tener caracteres especiales sin escapar

### Error: "Could not connect to any servers"
- Verifica que agregaste 0.0.0.0/0 en Network Access en Atlas
- Espera 2-3 minutos después de configurar el IP

### Error: "ENOTFOUND cluster0.xxxxx.mongodb.net"
- Verifica tu conexión a internet
- Verifica que copiaste bien la connection string

## 📝 Notas de Seguridad

- **NUNCA** subas el archivo `.env` a Git
- Ya está en `.gitignore` para protegerte
- En producción, usa variables de entorno del servidor (Fly.io secrets)
- Cambia TOKEN_SECRET antes de desplegar

## 🎯 Siguiente Paso

Una vez que el backend esté corriendo sin errores, puedes:
1. Abrir otra terminal
2. Iniciar el frontend
3. Probar la aplicación completa

