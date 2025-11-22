# 🚀 Deployment con Fly.io (Backend)

Fly.io es una excelente alternativa a Render. Aquí te explico cómo usarlo.

## 📋 Comparación Rápida

| Característica | Render | Fly.io |
|---------------|--------|--------|
| Plan Gratis | ✅ Sí | ✅ Sí |
| Fácil de usar | ✅ Muy fácil | ✅ Fácil |
| Performance | ✅ Bueno | ✅ Excelente |
| Configuración | Simple | Requiere CLI |

---

## 🚀 Opción 1: Fly.io + Netlify (Recomendado)

### Backend en Fly.io (10 minutos)

#### Paso 1: Instalar Fly CLI

```bash
# macOS
curl -L https://fly.io/install.sh | sh

# O con Homebrew
brew install flyctl
```

#### Paso 2: Login en Fly.io

```bash
fly auth login
```

#### Paso 3: Crear la App

Desde la carpeta `backend/`:

```bash
cd backend
fly launch
```

El CLI te hará preguntas:
- **App name**: `construction-marketplace-api` (o el que prefieras)
- **Region**: Elige el más cercano (ej: `mad` para Madrid)
- **Postgres/Redis**: No (presiona Enter)
- **Deploy now**: No (presiona 'n')

#### Paso 4: Configurar Variables de Entorno

```bash
fly secrets set NODE_ENV=production
fly secrets set MONGODB_URI="tu-connection-string-de-mongodb-atlas"
fly secrets set TOKEN_SECRET="tu-secreto-super-seguro-aqui"
fly secrets set CLOUDINARY_NAME="tu-cloudinary-name"
fly secrets set CLOUDINARY_KEY="tu-cloudinary-key"
fly secrets set CLOUDINARY_SECRET="tu-cloudinary-secret"
fly secrets set ORIGIN="https://tu-frontend.netlify.app"
```

⚠️ **Nota**: Deja `ORIGIN` vacío por ahora, lo actualizarás después del deploy del frontend.

#### Paso 5: Crear `fly.toml`

En `backend/`, crea o edita `fly.toml`:

```toml
app = "construction-marketplace-api"
primary_region = "mad"

[build]

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

#### Paso 6: Deploy

```bash
fly deploy
```

#### Paso 7: Obtener la URL

```bash
fly status
```

O ve a [fly.io/dashboard](https://fly.io/dashboard) y copia la URL (ej: `https://construction-marketplace-api.fly.dev`)

---

### Frontend en Netlify (igual que antes)

1. Ve a [netlify.com](https://netlify.com)
2. Importa tu repo
3. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Añade variable de entorno:
   ```
   VITE_API_URL=https://construction-marketplace-api.fly.dev/api
   ```
5. Deploy y copia la URL

---

### Actualizar ORIGIN en Fly.io

```bash
fly secrets set ORIGIN="https://tu-frontend.netlify.app"
```

O desde el dashboard: [fly.io/dashboard](https://fly.io/dashboard) → Tu app → Secrets

---

## ✅ Verificar

1. **Backend**: `https://tu-app.fly.dev/api/health`
2. **Frontend**: Tu URL de Netlify

---

## 🎯 Ventajas de Fly.io

- ✅ **Performance**: Muy rápido, edge computing
- ✅ **Escalado automático**: Se apaga cuando no se usa (plan gratis)
- ✅ **CLI potente**: Control total desde terminal
- ✅ **Logs en tiempo real**: `fly logs`

---

## 🆘 Comandos Útiles

```bash
# Ver logs
fly logs

# Ver status
fly status

# Abrir en el navegador
fly open

# Ver variables de entorno
fly secrets list

# Reiniciar la app
fly apps restart construction-marketplace-api
```

---

## 📝 Notas

- Fly.io usa el puerto **8080** por defecto (configurado en `fly.toml`)
- El plan gratis incluye 3 VMs compartidas
- Las apps se "duermen" después de 5 minutos de inactividad (se despiertan automáticamente)

---

¿Prefieres Fly.io o Render? Ambos funcionan perfectamente. 🚀

