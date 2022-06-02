const express = require('express');
const router = express.Router();
const {
  getCurrencyExchanges,
  createCurrencyExchange,
  updateCurrencyExchange,
  deleteCurrencyExchange,
} = require('../controllers/currencyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCurrencyExchanges);
router.post('/', protect, createCurrencyExchange);
router.put('/:id', protect, updateCurrencyExchange);
router.delete('/:id', protect, deleteCurrencyExchange);

module.exports = router;
