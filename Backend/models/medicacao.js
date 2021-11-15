const mongoose = require('mongoose')

var medicacaoSchema = new mongoose.Schema({    
    nr_utente_titular: {type: Number, required: true},
    nr_utente_pedido: {type: Number},
    nome: {type: String, required: true}, 
    medicacao: {type: String, required: true},
    medico: {type: String, required: true},
    contacto: {type: Number, required: true}, // 0 - email, 1 - sms
    data_criacao: {type: Date, default: Date.now, required: true}
  });

module.exports = mongoose.model('medicacao', medicacaoSchema)