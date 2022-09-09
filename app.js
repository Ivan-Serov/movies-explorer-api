require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { auth } = require('./middlewares/auth');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./utils/errors/allErrors');

const { DB_URL } = require('./constants/constants');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;

const app = express();
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(require('./routes/auth'));

app.use(auth);

app.use(require('./routes/user'));
app.use(require('./routes/movie'));

app.use((req, res, next) => next(new NotFoundError('Такой страницы не существует')));
app.use(errorLogger);
app.use(errors());

app.use(handleError);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : DB_URL, () => {
  console.log(`Connected to db on ${DB_URL}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
