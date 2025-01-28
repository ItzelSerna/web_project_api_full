const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('No se encontraron tarjetas');
      error.statusCode = 404;
      throw error;
    })
    .then((cards) => res.status(200).json(cards))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Error al obtener las tarjetas', error: err.message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => res.status(400).json({ message: 'Error al crear la tarjeta', error: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      return res.status(200).json({ message: 'Tarjeta eliminada con éxito' });
    })
    .catch((err) => res.status(500).json({ message: 'Error al eliminar la tarjeta', error: err.message }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      res.status(200).json(updatedCard);
    })
    .catch((err) => res.status(400).json({ message: 'Error al dar like', error: err.message }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      res.status(200).json(updatedCard);
    })
    .catch((err) => res.status(400).json({ message: 'Error al dar unlike', error: err.message }));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
