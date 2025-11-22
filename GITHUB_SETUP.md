# 📦 Configurar Repositorio en GitHub

Guía paso a paso para subir tu proyecto a GitHub antes de desplegar.

---

## ✅ Paso 1: Verificar .gitignore

Asegúrate de que estos archivos NO se suban a GitHub:

- `.env` (variables de entorno)
- `node_modules/` (dependencias)
- Archivos sensibles

Ya están configurados en `.gitignore` ✅

---

## 📝 Paso 2: Hacer Commit Inicial

```bash
# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Construction Marketplace MERN app"
```

---

## 🐙 Paso 3: Crear Repositorio en GitHub

### Opción A: Desde la Web (Más Fácil)

1. **Ve a [github.com](https://github.com)** y haz login
2. **Click en el botón "+"** (arriba derecha) → **"New repository"**
3. **Configura el repositorio**:
   - **Repository name**: `construction-marketplace` (o el nombre que prefieras)
   - **Description**: "B2B Marketplace for construction materials - MERN Stack"
   - **Visibility**: Public (o Private si prefieres)
   - ⚠️ **NO marques** "Initialize with README" (ya tienes archivos)
4. **Click "Create repository"**

### Opción B: Desde GitHub CLI (Si lo tienes instalado)

```bash
gh repo create construction-marketplace --public --source=. --remote=origin --push
```

---

## 🔗 Paso 4: Conectar Repo Local con GitHub

Después de crear el repo, GitHub te mostrará comandos. Ejecuta estos:

```bash
# Añadir el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/construction-marketplace.git

# Cambiar a la rama main (si no estás ya)
git branch -M main

# Subir el código
git push -u origin main
```

---

## ✅ Paso 5: Verificar

1. Ve a tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. Verifica que `.env` y `node_modules/` NO estén (están en .gitignore)

---

## 🚀 Siguiente Paso

Una vez que el código esté en GitHub, puedes proceder con el deployment:

- **Render/Fly.io** se conectará automáticamente a tu repo
- **Netlify** también se conectará automáticamente

---

## 📝 Comandos Rápidos (Resumen)

```bash
# 1. Añadir archivos
git add .

# 2. Commit
git commit -m "Initial commit: Construction Marketplace MERN app"

# 3. Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/construction-marketplace.git

# 4. Subir código
git push -u origin main
```

---

## 🆘 Si algo falla

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/construction-marketplace.git
```

### Error: "authentication failed"
- Usa un Personal Access Token en lugar de contraseña
- O configura SSH keys

---

¡Una vez que el código esté en GitHub, podemos proceder con el deployment! 🎉

