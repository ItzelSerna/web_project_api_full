const winston = require('winston');
const path = require('path');

const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/request.log') }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') }),
  ],
});

const logRequestMiddleware = (req, res, next) => {
  requestLogger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
};

const logErrorMiddleware = (err, req, res, next) => {
  errorLogger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
};

module.exports = {
  logRequestMiddleware,
  logErrorMiddleware,
};
