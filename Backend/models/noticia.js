const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({   
    titulo: {type: String, required: true}, 
    descricao: {type: String, required: true},
    medico: {type: String, required: true},
    data_criacao: {type: Date, required: true},
    data_alteracao: {type: Date, required: true} 
  });

module.exports = mongoose.model('noticia', noticiaSchema)