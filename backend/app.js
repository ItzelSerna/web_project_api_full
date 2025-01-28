const express = require('express');
const mongoose = require('mongoose'); // Importa mongoose para manejar MongoDB
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();
const PORT = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Middleware para la autorización temporal
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // ID del usuario de prueba
  };

  next();
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middleware para manejar las rutas
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

// Middleware para manejar errores en el servidor
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ message: statusCode === 500 ? 'Error interno del servidor' : message });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
