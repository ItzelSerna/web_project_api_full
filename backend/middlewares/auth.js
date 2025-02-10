const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Se requiere autorización' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!/^[a-f\d]{24}$/i.test(payload._id)) {
      return res.status(400).json({ message: '"userId" must only contain hexadecimal characters' });
    }

    req.user = payload;
  } catch (err) {
    return res.status(403).json({ message: 'Token no válido' });
  }

  return next();
};
