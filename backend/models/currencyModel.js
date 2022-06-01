const mongoose = require('mongoose');

const currencyExchangeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // TODO: remember to make true
      ref: 'User',
    },
    from: String,
    to: String,
    ratio: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CurrencyExchange', currencyExchangeSchema);
