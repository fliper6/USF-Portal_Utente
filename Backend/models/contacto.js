const mongoose = require('mongoose')

var contactoSchema = new mongoose.Schema({
    contactos: String,
    email: String,
    telefone: String,
    horario_atendimento: String,
    marcacao_consultas: String,
    e_agenda: String
  });

module.exports = mongoose.model('contacto', contactoSchema)