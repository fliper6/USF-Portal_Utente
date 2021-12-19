const mongoose = require('mongoose')

var contactoSchema = new mongoose.Schema({
    nome: String,
    profissao: String,
    morada: String,
    email: String,
    telefone: String,
    horario_atendimento: String,
    marcacao_consultas: String,
    e_agenda: String, //nao sei o que é isto
    type: Number,
    coordenadas: String,
    equipa: Number,
  });

module.exports = mongoose.model('contacto', contactoSchema)