const mongoose = require('mongoose')

var codigoSchema = new mongoose.Schema({
    email: {type: String, required: true}, 
    codigo: {type: String, required: true},
    createdAt: {type: Date, expires: '1h', default: Date.now}
  });

module.exports = mongoose.model('codigo', codigoSchema)