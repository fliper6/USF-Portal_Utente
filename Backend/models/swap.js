const mongoose = require('mongoose')

var swapSchema = new mongoose.Schema({
    idUser: {type: mongoose.Schema.Types.ObjectId, required: true},
    codigo: {type: String, required: true},
    email_antigo: {type: String, required: true},
    email_novo: {type: String, required: true}, 
    estado: {type: Number, required: true, default: 0}, // 0 - Pendente, 1 - Aceite, 2 - Recusado 
    createdAt: {type: Date, expires: '7d', default: Date.now}
  });

module.exports = mongoose.model('swap', swapSchema)