const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createOrder, renderProductPage } = require('../controllers/PaymentController');

const payment_route = express();

// Middleware setup
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended: false }));

// View engine and views directory setup
payment_route.set('view engine', 'ejs');
payment_route.set('views', path.join(__dirname, '../views'));

// Routes setup
payment_route.get('/', renderProductPage);
payment_route.post('/createOrder', createOrder);

module.exports = payment_route;
