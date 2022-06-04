const asyncHandler = require('express-async-handler');
const CurrencyExchanges = require('../models/currencyModel');

// @desc Get Currency Exchanges
// @route GET /api/currency_exchange_rates
// @access Private
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

// @desc Create Currency Exchange
// @route POST /api/currency_exchange_rates
// @access Private
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

// @desc Update Currency Exchange
// @route PUT /api/currency_exchange_rates:id
// @access Private
const updateCurrencyExchange = asyncHandler(async (req, res) => {
  const currencyExchange = await CurrencyExchanges.findById(req.params.id);
  if (!currencyExchange) {
    res.status(400);
    throw new Error('Currency Exchange not found');
  }

  const updatedCurrencyExchange = await CurrencyExchanges.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  console.log('updated!!!', updatedCurrencyExchange);
  res.status(200).json(updatedCurrencyExchange);
});

// @desc Delete Currency Exchange
// @route DELETE /api/currency_exchange_rates/:id
// @access Private
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
