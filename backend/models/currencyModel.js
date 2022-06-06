const mongoose = require('mongoose');

const currencyExchangeSchema = mongoose.Schema(
  {
    from: String,
    to: String,
    ratio: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CurrencyExchange', currencyExchangeSchema);
