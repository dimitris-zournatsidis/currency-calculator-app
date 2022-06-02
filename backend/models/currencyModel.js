const mongoose = require('mongoose');

const currencyExchangeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // TODO: remember to make true
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
