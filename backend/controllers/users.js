const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      const error = new Error('No se encontraron usuarios');
      error.statusCode = 404;
      throw error;
    })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      } else if (err.code === 11000) {
        err.statusCode = 409;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Correo o contraseña incorrectos');
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Correo o contraseña incorrectos');
            error.statusCode = 401;
            throw error;
          }

          const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });

          return res.status(200).json({
            token,
            redirectUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard`,
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateProfile,
  updateAvatar,
  getCurrentUser,
};
