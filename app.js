const express = require('express');
const app = express();
const morgan = require('morgan')

const productsRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

//use morgan for logs before handling requests
app.use(morgan('dev'));

// Handling requests
app.use('/products', productsRoutes);
app.use('/orders', orderRoutes)

//Handle errors for routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Middleware to handle all other errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;