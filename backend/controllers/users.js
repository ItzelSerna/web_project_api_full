const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error('No se encontraron usuarios');
      error.statusCode = 404;
      throw error;
    })
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID de usuario no válido' });
      }
      res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).json(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Datos no válidos', error: err.message });
      }
      res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(400).json({ message: 'Error al actualizar el perfil', error: err.message }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(400).json({ message: 'Error al actualizar el avatar', error: err.message }));
};

module.exports = { getUsers, getUserById, createUser, updateProfile, updateAvatar };
