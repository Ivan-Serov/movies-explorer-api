const PORT = 3000;

const devJwtSECRET = 'dev-key';

const DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const JWT_STORAGE_TIME = '7d';
const SALT_LENGTH = 10;

module.exports = {
  PORT,
  devJwtSECRET,
  DB_URL,
  SALT_LENGTH,
  JWT_STORAGE_TIME,
};
