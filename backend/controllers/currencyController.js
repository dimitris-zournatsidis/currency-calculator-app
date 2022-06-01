const asyncHandler = require('express-async-handler');
const CurrencyExchanges = require('../models/currencyModel');
const User = require('../models/userModel');

// @desc Get Currency Exchanges
// @route GET /api/currency_exchange_rates
// @access Private
const getCurrencyExchanges = asyncHandler(async (req, res) => {
  const currencyExchanges = await CurrencyExchanges.find({ user: req.body.id });
  res.status(200).json(currencyExchanges);
});

// @desc Set Currency Exchanges
// @route POST /api/currency_exchange_rates
// @access Private
const setCurrencyExchange = asyncHandler(async (req, res) => {
  if (!req.body.from || !req.body.to || !req.body.ratio) {
    res.status(400);
    throw new Error('Please add all required fields');
  }
  const currencyExchanges = await CurrencyExchanges.create({
    from: req.body.from,
    to: req.body.to,
    ratio: req.body.ratio,
    // user: req.user.id,
  });
  res.status(200).json(currencyExchanges);
});

// @desc Update Currency Exchange
// @route PUT /api/currency_exchange_rates:id
// @access Private
const updateCurrencyExchange = asyncHandler(async (req, res) => {
  const currencyExchanges = await CurrencyExchanges.findById(req.params.id);
  if (!currencyExchanges) {
    res.status(400);
    throw new Error('Currency Exchange not found');
  }

  const user = await User.findById(req.user.id);
  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the currencyExchange user
  if (currencyExchanges.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedcurrencyExchange = await CurrencyExchanges.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedcurrencyExchange);
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

  const user = await User.findById(req.user.id);
  // check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the currency exchange admin
  if (currencyExchanges.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await currencyExchanges.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCurrencyExchanges,
  setCurrencyExchange,
  updateCurrencyExchange,
  deleteCurrencyExchange,
};
