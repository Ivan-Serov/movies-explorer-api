const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  image: {
    type: String,
    required: true,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validator: (link) => {
      validator.isURL(link, {
        protocols: ['http', 'https'],
        require_protocol: true,
      });
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
