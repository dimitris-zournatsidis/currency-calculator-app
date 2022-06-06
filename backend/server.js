const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');

dotenv.config();

// Connect mongoose to MongoDB
connectDB();

const app = express();
app.use(cors());

// Middleware for POST and PUT requests
// express.json(), in order to recognize the incoming request object as a JSON object
// express.urlencoded(), in order to recognize the incoming request object as strings or arrays
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/currency_exchange_rates', require('./routes/currencyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Middleware that overwrites the default express error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
