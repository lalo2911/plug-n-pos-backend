# 🛒 Plug n POS - Backend API

> **Sistema de punto de venta moderno y ligero diseñado para pequeños negocios**

Un backend robusto y escalable para un sistema POS completo, optimizado para negocios que no emplean el uso de códigos de barras como panaderías, cafeterías, negocios de alimentos, etc.

## ✨ Características Principales

- 🔐 **Autenticación Completa**: JWT + Refresh Tokens + Google OAuth 2.0
- 👥 **Gestión de Usuarios**: Roles diferenciados (Owner/Employee)
- 🧩 **Invitación de Empleados**: Generación de códigos para la vinculación de empleados.
- 📦 **Inventario Inteligente**: Gestión de productos y categorías
- 💰 **Procesamiento de Ventas**: Sistema completo de órdenes y detalles
- 📊 **Métricas Avanzadas**: Dashboard con analytics del negocio
- ⏰ **Control Laboral**: Gestión de jornadas de trabajo
- 🌐 **Integración Cloud**: Almacenamiento de imágenes con Cloudinary
- 🛡️ **Seguridad**: Rate limiting, validación de datos, y encriptación

## 🚀 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Passport.js (Local + Google OAuth)
- **Tokens**: JSON Web Tokens (JWT)
- **Almacenamiento**: Cloudinary para imágenes
- **Seguridad**: Helmet, bcrypt, express-rate-limit
- **Validación**: express-validator
- **Automatización**: node-cron para tareas programadas

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- Cuenta de Cloudinary
- Google OAuth credentials (opcional)

## ⚙️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/lalo2911/plug-n-pos-backend.git
   cd plug-n-pos-backend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   NODE_ENV=development
   API_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   REFRESH_ROTATION_THRESHOLD_MINUTES=60
   MONGODB_URI=mongodb://localhost:27017/plug-n-pos
   JWT_SECRET=tu-jwt-secret-super-secreto
   GOOGLE_CLIENT_ID=tu-google-client-id
   GOOGLE_CLIENT_SECRET=tu-google-client-secret
   CLOUDINARY_CLOUD_NAME=tu-cloudinary-cloud-name
   CLOUDINARY_API_KEY=tu-cloudinary-api-key
   CLOUDINARY_API_SECRET=tu-cloudinary-api-secret
   ```

4. **Inicia el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 🔗 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/refresh` - Renovar token
- `GET /api/v1/auth/google` - Autenticación con Google

### Gestión de Datos
- `GET/POST/PUT/DELETE /api/v1/users` - Gestión de usuarios
- `GET/POST/PUT/DELETE /api/v1/categories` - Categorías de productos
- `GET/POST/PUT/DELETE /api/v1/products` - Productos del inventario
- `GET/POST/PUT/DELETE /api/v1/orders` - Órdenes de venta
- `GET/POST/PUT/DELETE /api/v1/order-details` - Detalles de órdenes

### Funcionalidades Avanzadas
- `GET /api/v1/metrics` - Métricas y analytics del negocio
- `GET/POST /api/v1/workday` - Control de jornadas laborales
- `GET/POST/PUT /api/v1/business` - Configuración del negocio

> **Entre otros mas...**

## 🏗️ Estructura del Proyecto

```
src/
├── config/         # Configuraciones (DB, Passport)
├── controllers/    # Manejo de peticiones HTTP y conexión con los servicios
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio y acceso a modelos
├── utils/          # Utilidades y helpers
└── validators/     # Validadores de entrada
```

## 🔒 Seguridad

- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación**: Sanitización de datos de entrada
- **CORS**: Configurado para el frontend específico
- **Helmet**: Headers de seguridad HTTP

## 📊 Características del Sistema POS

### Para Owners (Propietarios)
- Dashboard completo con métricas
- Gestión de empleados
- Configuración del negocio
- Control de inventario

### Para Employees (Empleados)
- Procesamiento de pedidos
- Consulta de productos

## 👨‍💻 Desarrollador

**Luis Eduardo Torres Gutiérrez** - [GitHub](https://github.com/lalo2911) | [LinkedIn](https://linkedin.com/in/ltorresdev)

---

## 🔗 Repositorios Relacionados

- [Plug n POS Frontend](https://github.com/lalo2911/plug-n-pos-frontend) - Interfaz de usuario React