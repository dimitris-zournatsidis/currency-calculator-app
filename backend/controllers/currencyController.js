const asyncHandler = require('express-async-handler');
const CurrencyExchanges = require('../models/currencyModel');

// Get Currency Exchanges
// GET /api/currency_exchange_rates
const getCurrencyExchanges = asyncHandler(async (req, res) => {
  let currencyExchanges;
  if (req.params.from && req.params.to) {
    currencyExchanges = await CurrencyExchanges.findOne({
      from: req.params.from,
      to: req.params.to,
    });
  } else {
    currencyExchanges = await CurrencyExchanges.find();
  }
  res.status(200).json(currencyExchanges);
});

// Create Currency Exchange
// POST /api/currency_exchange_rates
const createCurrencyExchange = asyncHandler(async (req, res) => {
  if (!req.body.from || !req.body.to || !req.body.ratio) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const currencyExchanges = await CurrencyExchanges.create({
    from: req.body.from,
    to: req.body.to,
    ratio: req.body.ratio,
  });
  res.status(200).json(currencyExchanges);
});

// Update Currency Exchange
// PUT /api/currency_exchange_rates:id
const updateCurrencyExchange = asyncHandler(async (req, res) => {
  const currencyExchange = await CurrencyExchanges.findById(req.params.id);
  if (!currencyExchange) {
    res.status(400);
    throw new Error('Currency Exchange not found');
  }

  const updatedCurrencyExchange = await CurrencyExchanges.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedCurrencyExchange);
});

// Delete Currency Exchange
// DELETE /api/currency_exchange_rates/:id
const deleteCurrencyExchange = asyncHandler(async (req, res) => {
  const currencyExchanges = await CurrencyExchanges.findById(req.params.id);
  if (!currencyExchanges) {
    res.status(400);
    throw new Error('Currency exchange not found');
  }
  await currencyExchanges.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCurrencyExchanges,
  createCurrencyExchange,
  updateCurrencyExchange,
  deleteCurrencyExchange,
};
