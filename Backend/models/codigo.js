const mongoose = require('mongoose')

var codigoSchema = new mongoose.Schema({
    email: {type: String, required: true}, 
    codigo: {type: String, required: true},
    tipo: {type: Number, required: true, default: 0}, // 0 -> Registar, 1 -> Alterar Email, 2 -> Reset PW
    createdAt: {type: Date, expires: '1h', default: Date.now}
  });

module.exports = mongoose.model('codigo', codigoSchema)