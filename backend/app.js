console.log("CLIENT_URL en producción:", process.env.CLIENT_URL);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { logRequestMiddleware, logErrorMiddleware } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");

const { createUser, login } = require("./controllers/users");
const usersRoutes = require("./routes/users");
const cardsRoutes = require("./routes/cards");

const { validateCreateUser, validateLogin } = require("./middlewares/validation");

const app = express();
const PORT = process.env.PORT || 3001;
console.log("Valor de PORT:", process.env.PORT, "y PORT usado:", PORT);

if (process.env.NODE_ENV !== "production") {
  process.env.JWT_SECRET = "clave-secreta-desarrollo"; // Fallback para desarrollo
  console.log("⚠️ Ejecutando en modo desarrollo sin .env");
}

// Configurar CORS dinámicamente usando CLIENT_URL desde .env
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3001",
  "https://itzelserna.lat",
  "https://www.itzelserna.lat",
  "https://api.itzelserna.lat",
  "https://front-end.itzelserna.lat",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes desde orígenes explícitos o sin origen (por ejemplo, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // Para manejo de cookies o autenticación basada en sesión
  })
);

app.options("*", cors());
app.use(express.json());
app.use(logRequestMiddleware);

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/aroundb";
mongoose
  .connect(mongoUri)
  .then(() => console.log(`Conectado a MongoDB en: ${mongoUri}`))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });

// Mostrar en consola el CLIENT_URL
console.log("Frontend permitido en:", process.env.CLIENT_URL);

// Rutas públicas
app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

// Middleware de autenticación para proteger rutas privadas
app.use(auth);
app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

// Middlewares de errores
app.use(logErrorMiddleware);
app.use(errorHandler);

// Iniciar el servidor (única llamada a app.listen)
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo ordenado de señales para cerrar el servidor
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido. Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT recibido. Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado.");
    process.exit(0);
  });
});
