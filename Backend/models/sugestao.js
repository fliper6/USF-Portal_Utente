const mongoose = require('mongoose')

var sugestaoSchema = new mongoose.Schema({
    nr_utente: {type: String, required: true},   
    titulo: {type: String, required: true}, 
    descricao: {type: String, required: true},
    data_criacao: {type: Date, default: Date.now, required: true}
  });

module.exports = mongoose.model('sugestao', sugestaoSchema)