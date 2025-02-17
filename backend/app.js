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
  process.env.JWT_SECRET = "clave-secreta-desarrollo";
  console.log("⚠️ Ejecutando en modo desarrollo sin .env");
}

const allowedOrigins = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
     process.env.CLIENT_URL,
    'https://itzelserna.lat',
    'https://www.itzelserna.lat',
    'https://api.itzelserna.lat',
    'https://front-end.itzelserna.lat'
  ],
  credentials: true
};

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(logRequestMiddleware);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/aroundb";
mongoose
  .connect(mongoUri)
  .then(() => console.log(`Conectado a MongoDB en: ${mongoUri}`))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });

console.log("Frontend permitido en:", process.env.CLIENT_URL);

app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

app.use(auth);
app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

app.use(logErrorMiddleware);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

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
