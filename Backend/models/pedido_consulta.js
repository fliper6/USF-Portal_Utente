const mongoose = require('mongoose')

var consultaSchema = new mongoose.Schema({
    nr_utente_titular: {type: Number, required: true},
    nr_utente_pedido: {type: Number, required: true},
    nome: {type: String, required: true}, 
    tipo: {type: String, required: true}, // Tipo: "Agendar consulta médica" pode ser substituido depois por uma key-value, 0-"Agendar Consulta médica" etc
    motivo: {type: String, required: false},
    medico: {type: String, required: true},
    contacto: {
        tipo: {type: Number, required: true}, // 0 - email, 1 - sms
        valor: {type: String, required: true}
    },
    estado: {type: Number, required: true, default: 0} // 0- Pendente, 1- Aceite, 2- Recusada
  });

module.exports = mongoose.model('pedido_consulta', consultaSchema)