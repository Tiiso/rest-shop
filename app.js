const express = require('express');
const app = express();
const morgan = require('morgan');
//-- deprecated ## built into express
//const bodyParser = require('body-parser'); 

const productsRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

//use morgan for logs before handling requests
app.use(morgan('dev'));
//parse URLs and JSON to the body
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

//Adding Headers --- CORS errors handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
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