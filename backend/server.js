const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/currency_exchange_rates', require('./routes/currencyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// that overwrites the default express error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));