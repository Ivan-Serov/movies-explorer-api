const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/allErrors');

const { JWT_SECRET, NODE_ENV } = process.env;
const { devJwtSECRET } = require('../constants/constants');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJwtSECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
