const Card = require('../models/card');
const { ObjectId } = require('mongoose').Types;

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('No se encontraron tarjetas');
      error.statusCode = 404;
      throw error;
    })
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).json(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  console.log("🔍 Intentando eliminar tarjeta con ID:", cardId);

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: "Tarjeta no encontrada" });
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "No tienes permisos para borrar esta tarjeta" });
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => {
          res.status(200).json({ message: "Tarjeta eliminada con éxito" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        const error = new Error('Tarjeta no encontrada');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(updatedCard);
    })
    .catch((err) => {
      console.error('Error en deleteCard:', err);
      if (err.name === 'CastError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        const error = new Error('Tarjeta no encontrada');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(updatedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
