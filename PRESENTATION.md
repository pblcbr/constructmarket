# Construction Marketplace - Project Presentation

## Slide 1: Título
**Construction Materials Marketplace**
Plataforma B2B para compra/venta de materiales de construcción sobrantes

*Proyecto Final - IronHack Master Program*
*Tu Nombre*

---

## Slide 2: El Problema
### Situación Actual
- Las obras generan materiales sobrantes (vallas, conos, palets, andamios...)
- Actualmente se venden fuera de la empresa
- Se pierde margen de beneficio
- No se reutilizan entre proyectos de la misma empresa

---

## Slide 3: La Solución
### Marketplace Interno B2B
- **Jefes de obra venden** materiales sobrantes → Aumentan márgenes
- **Otros jefes compran** a precio reducido → Reducen costes
- **La empresa optimiza** recursos → Sostenibilidad

**Win-Win-Win** 🎯

---

## Slide 4: Tech Stack
### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt para passwords
- express-validator

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios

---

## Slide 5: Arquitectura
```
Frontend (SPA React) ←→ REST API ←→ MongoDB
    ↓                      ↓              ↓
  Vite               Express.js      Mongoose
  Tailwind           JWT Auth        3 Models
  Context API        Validation      
```

---

## Slide 6: Modelos de Datos
### 3 Modelos Principales
1. **User** - Jefes de obra (email, password, name, company, project)
2. **Material** - Productos en venta (title, price, quantity, category, seller)
3. **Transaction** - Compras/Ventas (buyer, seller, material, status)

---

## Slide 7: Funcionalidades Clave
✅ Autenticación completa (signup, login, logout)
✅ CRUD completo de materiales
✅ Sistema de filtros avanzados
✅ Transacciones/Órdenes de compra
✅ Gestión de perfil
✅ Rutas protegidas
✅ Diseño responsive

---

## Slide 8: Demo - Registro y Login
*[MOSTRAR EN VIVO]*
1. Registro de nuevo usuario
2. Login
3. Navegación por el navbar

---

## Slide 9: Demo - Publicar Material
*[MOSTRAR EN VIVO]*
1. Formulario de crear material
2. Validación de campos
3. Confirmación de publicación
4. Ver en "Mis Materiales"

---

## Slide 10: Demo - Marketplace
*[MOSTRAR EN VIVO]*
1. Explorar el marketplace
2. Aplicar filtros (categoría, precio, condición)
3. Ver detalles de un material
4. Información del vendedor

---

## Slide 11: Demo - Realizar Compra
*[MOSTRAR EN VIVO]*
1. Seleccionar material
2. Solicitar compra (cantidad, notas)
3. Ver transacción creada
4. Estado de la transacción

---

## Slide 12: Código Destacable - Backend
### Middleware de Autenticación
```javascript
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

---

## Slide 13: Código Destacable - Frontend
### Context API para Auth
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    setUser(response.data.user);
    setIsAuthenticated(true);
  };
  
  return <AuthContext.Provider value={{ user, login }}>
    {children}
  </AuthContext.Provider>;
};
```

---

## Slide 14: Desafíos y Aprendizajes
### Desafíos
- Gestión del estado de autenticación entre componentes
- Validación sincronizada frontend/backend
- Flujo de transacciones entre usuarios

### Aprendizajes
- Arquitectura de API REST bien estructurada
- Context API para state management
- Importancia de la validación y manejo de errores

---

## Slide 15: Mejoras Futuras
- 📸 Upload de imágenes (Cloudinary)
- 💬 Sistema de mensajería entre usuarios
- ⭐ Sistema de valoraciones/reviews
- 📊 Dashboard con estadísticas
- 🔔 Notificaciones en tiempo real (Socket.io)
- 🌍 Geolocalización de materiales

---

## Slide 16: Cumplimiento de Requisitos
✅ SPA con React y múltiples vistas
✅ REST API con Express + MongoDB
✅ 3+ modelos de base de datos
✅ CRUD completo
✅ Autenticación y autorización
✅ Validación backend
✅ Manejo de errores centralizado
✅ Código limpio y modular
✅ 2 repositorios en GitHub
✅ Desplegado online

---

## Slide 17: URLs del Proyecto
**GitHub Repositories:**
- Backend: `github.com/usuario/construction-marketplace-backend`
- Frontend: `github.com/usuario/construction-marketplace-frontend`

**Deployed Apps:**
- Backend API: `tu-app.fly.dev`
- Frontend SPA: `tu-app.netlify.app`

**Presentación:**
- Slides: `slides.com/tu-presentacion`

---

## Slide 18: Impacto del Proyecto
### Beneficios Empresariales
💰 **Aumenta márgenes** de las obras
📉 **Reduce costes** de materiales
♻️ **Promueve sostenibilidad**
🤝 **Fomenta colaboración** entre equipos

---

## Slide 19: Tecnologías y Best Practices
- ✅ MERN Stack completo
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Clean code
- ✅ Git version control

---

## Slide 20: Gracias
**¡Gracias por su atención!**

¿Preguntas? 🙋

---

*Contacto: tu@email.com*
*GitHub: @tuusuario*

---

## Notas para la Presentación

### Tiempo: 10 minutos
- Introducción: 1 min
- Problema y solución: 1 min  
- Stack técnico: 1 min
- Demo en vivo: 4 min
- Código destacable: 1 min
- Desafíos y aprendizajes: 1 min
- Cierre y preguntas: 1 min

### Tips
- Tener la aplicación ya abierta en pestañas
- Tener 2 usuarios ya creados para demo
- Verificar que backend está corriendo
- Practicar el demo varias veces
- Preparar respuestas a preguntas técnicas comunes
- Mostrar entusiasmo y confianza

### Posibles Preguntas
1. ¿Por qué elegiste este stack?
2. ¿Cuál fue el mayor desafío técnico?
3. ¿Cómo manejas la seguridad?
4. ¿Cómo escalaría la aplicación?
5. ¿Qué harías diferente?

