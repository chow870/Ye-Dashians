import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';  // Needed to resolve `__dirname` in ES modules
import {createOrder,renderProductPage}from '../controllers/paymentController.js'; // Use ES module syntax

const payment_route = express();

// Middleware setup
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended: false }));

// Resolving __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine and views directory setup
payment_route.set('view engine', 'ejs');
payment_route.set('views', path.join(__dirname, '../views'));

// Routes setup
payment_route.get('/', renderProductPage);
payment_route.post('/createOrder', createOrder);

export default payment_route;
