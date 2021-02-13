const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const authRouter = require('./routes/authRouter')
const productsRouter = require('./routes/productsRouter')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const API = '/api/v1/';
app.all('*', [ require('./guards/tokenGuard') ])
app.use(API, authRouter);
app.use(API+'products/', productsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json('API not found');
});

module.exports = app;
