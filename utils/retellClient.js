const Retell = require('retell-sdk');
require('dotenv').config();

const createRetellClient = () => {
  if (!process.env.RETELL_API_KEY) {
    throw new Error('RETELL_API_KEY should be loaded from .env');
  }
  return new Retell({
    apiKey: process.env.RETELL_API_KEY,
  });
};

module.exports = {
  createRetellClient,
};
