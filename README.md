# Proyecto 18 – Web Project API Full

## Descripción del Proyecto

Este proyecto es la culminación de un proceso de aprendizaje en el que se integran el front-end y el back-end para crear una aplicación web completa. La aplicación permite a los usuarios registrarse y autenticarse utilizando correo electrónico y contraseña, genera tokens JWT para gestionar sesiones de forma segura y protege las rutas mediante un middleware de autorización. Además, se implementa un manejo centralizado de errores, validación de solicitudes y registro de logs (tanto de solicitudes como de errores).

---

## Las principales funcionalidades incluyen:

- **Registro e inicio de sesión:** Creación de usuarios, autenticación y generación de un token JWT con caducidad de 7 días.
- **Protección de rutas:** Solo los usuarios autenticados pueden acceder a rutas protegidas (por ejemplo, edición de perfil, gestión de tarjetas, etc.).
- **Validación y manejo de errores:** Uso de Joi/celebrate para validar entradas y un middleware centralizado que gestiona y formatea los errores (respondiendo con códigos 400, 403, 404, 409 o 500 según corresponda).
- **Despliegue y conectividad:** El proyecto está organizado en dos carpetas principales (frontend y backend) y se despliega en un servidor remoto accesible mediante HTTP y HTTPS, utilizando herramientas como PM2 y Nginx.

---

## Tecnologías y Herramientas Utilizadas

- **Front-end:**
  - React
  - React Router
  - CSS 
  
- **Back-end:**
  - Node.js
  - Express
  - MongoDB con Mongoose
  - JSON Web Tokens (JWT)
  
- **Validación y Seguridad:**
  - Joi y celebrate para validación de datos
  - validator para la validación de correos y URLs
  
- **Logging y Manejo de Errores:**
  - Middleware centralizado para errores
  - Registro de solicitudes y errores 
  
- **Despliegue y Gestión de Procesos:**
  - PM2 para la recuperación automática del servidor en caso de caídas
  - Nginx para conectar el front-end con el back-end y gestionar el dominio
  - Certificados SSL para HTTPS

---

## Notas Adicionales

- **Códigos de Error y Manejo de Errores:**  
  La API implementa respuestas con los siguientes códigos según la situación:
  - **400:** Datos inválidos.
  - **403:** Acceso no autorizado (por ejemplo, intento de borrar una tarjeta de otro usuario).
  - **404:** Recurso no encontrado.
  - **409:** Conflicto en el registro (correo ya existente).
  - **500:** Error interno del servidor.
  
- **Autorización:**  
  Todas las rutas, excepto `/signin` y `/signup`, están protegidas mediante un middleware que valida el JWT. En caso de token inválido o ausencia del mismo, se devuelve un error 401/403.

- **Logging:**  
  Las solicitudes se registran en `request.log` y los errores en `error.log`. 

- **Buenas Prácticas y Estilo de Código:**  
  Se ha seguido una estructura de código coherente y se han aplicado buenas prácticas en el nombrado de variables y en la organización de componentes y módulos.

---

## Despliegue

La aplicación está desplegada y es accesible desde el siguiente dominio:

- [https://itzelserna.lat/](https://itzelserna.lat/)

---

## Despliegue de API

La API está desplegada y es accesible desde el siguiente dominio:

- [https://api.itzelserna.lat/](https://api.itzelserna.lat/)