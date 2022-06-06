# Currency Calculator

A currency calculator using MERN Stack (MongoDB, Express, React, Node.js).

## Prerequisites
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com/)

## Installation
Clone the repository to your local environment or download the ZIP file.\
Run `npm install` in both root and frontend directories.

## Running the Application
In order to run **concurrently** server and client, run:

`npm run dev` in the root directory.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The endpoints are located in [http://localhost:5000](http://localhost:5000).

## Available Endpoints

- POST `/api/users`
- POST `/api/users/login`

- GET `/api/currency_exchange_rates`
- GET `/api/currency_exchange_rates/:from/:to` (from and to replaced by currencies)
- POST `/api/currency_exchange_rates`
- PUT `/api/currency_exchange_rates/:id`
- DELETE `/api/currency_exchange_rates/:id`
