const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorMessage } = require('../utils/errorMessage');
const { NotFoundError } = require('../utils/errors/allErrors');
const { JWT_STORAGE_TIME, SALT_LENGTH, devJwtSECRET } = require('../constants/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, SALT_LENGTH)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.send({ _id, email, name });
    })
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь (ID) не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwtSECRET, {
        expiresIn: JWT_STORAGE_TIME,
      });
      res.send({ token });
    })
    .catch(next);
};
