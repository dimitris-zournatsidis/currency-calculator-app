const express = require('express');
const router = express.Router();
const {
  getCurrencyExchanges,
  setCurrencyExchange,
  updateCurrencyExchange,
  deleteCurrencyExchange,
} = require('../controllers/currencyController');
// const { protect } = require('../middleware/authMiddleware');
// if needed, add protect as the second parameter below

router.get('/', getCurrencyExchanges);
router.post('/', setCurrencyExchange);
router.put('/:id', updateCurrencyExchange);
router.delete('/:id', deleteCurrencyExchange);

module.exports = router;
