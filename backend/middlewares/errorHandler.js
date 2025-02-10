const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const joiError = err.details.get('body')
      || err.details.get('params')
      || err.details.get('query')
      || err.details.get('headers');

    const message = joiError ? joiError.message : 'Datos de solicitud inválidos';
    return res.status(400).json({ message });
  }

  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'An unexpected error ocurred' : message,
  });
};

module.exports = errorHandler;
