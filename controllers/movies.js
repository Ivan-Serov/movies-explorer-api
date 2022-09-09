const Movie = require('../models/movie');
const { errorMessage } = require('../utils/errorMessage');
const { NotFoundError, ForbiddenError } = require('../utils/errors/allErrors');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner }).sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    country,
    director,
    description,
    year,
    duration,
    trailerLink,
    image,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    description,
    year,
    duration,
    trailerLink,
    image,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => errorMessage(err, req, res, next));
};
