const mongoose = require('mongoose')

var medicacaoSchema = new mongoose.Schema({    
    nr_utente_titular: {type: Number, required: true},
    nr_utente_pedido: {type: Number, required: true},
    nome: {type: String, required: true}, 
    medicacao: {type: String, required: true},
    medico: {type: String, required: true},
    contacto: {
        tipo: {type: Number, required: true}, // 0 - email, 1 - sms
        valor: {type: String, required: true}
    }
  });

module.exports = mongoose.model('pedido_medicacao', medicacaoSchema)