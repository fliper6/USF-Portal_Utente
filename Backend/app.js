var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var session = require("express-session");

// PASSPORT + MONGODB
require('./config/database')
require('./config/passport')(passport)

// ROUTES
var usersRouter = require('./routes/users');
var contactosRouter = require('./routes/contactos');
var medicacaoRouter = require('./routes/medicacao');
var sugestaoRouter = require('./routes/sugestao');

var app = express();

// OTHER MIDDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// PASSPORT MIDDLEWARE
app.use(session({
    secret: "PI2021",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// ROUTES MIDDLEWARE
app.use('/users', usersRouter);
app.use('/contactos', contactosRouter);
app.use('/medicacao', medicacaoRouter);
app.use('/sugestao', sugestaoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next("Rota Inexistente", req,res, next);
});

app.use(function(error, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
  
    // render the error 
    res.status(error.status || 500).jsonp({error});
});

module.exports = app;