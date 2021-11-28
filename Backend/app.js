var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var session = require("express-session");
var fs = require('fs');

// PASSPORT + MONGODB
require('./config/database')
require('./config/passport')(passport)

// ROUTES
var usersRouter = require('./routes/users');
var consultasRouter = require('./routes/consultas');
var contactosRouter = require('./routes/contactos');
var documentosRouter = require('./routes/documentos');
var medicacaoRouter = require('./routes/medicacao');
var medicoRouter = require('./routes/medico');
var noticiasRouter = require('./routes/noticias');
var sugestaoRouter = require('./routes/sugestao');

var app = express();

if (!fs.existsSync("./public")) { fs.mkdirSync("./public") }
if (!fs.existsSync("./public/fileStore")) { fs.mkdirSync("./public/fileStore") }
if (!fs.existsSync("./public/fileStore/documentos")) { fs.mkdirSync("./public/fileStore/documentos") }
if (!fs.existsSync("./public/fileStore/noticias")) { fs.mkdirSync("./public/fileStore/noticias") }

// OTHER MIDDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/consultas', consultasRouter);
app.use('/contactos', contactosRouter);
app.use('/documentos', documentosRouter);
app.use('/medicacao', medicacaoRouter);
app.use('/medicos', medicoRouter);
app.use('/noticias', noticiasRouter);
app.use('/sugestao', sugestaoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next("Rota Inexistente", req,res,next);
});

app.use(function(error, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
  
    // render the error 
    res.status(error.status || 500).jsonp({error});
});

module.exports = app;