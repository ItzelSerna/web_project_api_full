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

// Configurar CORS dinámicamente usando `CLIENT_URL` desde `.env`
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://itzelserna.lat",
  "https://www.itzelserna.lat",
  "https://api.itzelserna.lat"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS bloqueó una solicitud desde: ${origin}`);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // Permite cookies y encabezados con credenciales
  })
);

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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en https://api.itzelserna.lat o en el puerto ${PORT}`);
});
