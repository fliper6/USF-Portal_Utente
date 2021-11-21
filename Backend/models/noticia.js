const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({   
    titulo: {type: String, required: true}, 
    corpo: {type: String, required: true},
    _id_autor: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true},
    nome_autor: {type: String, required: true},
    data_criacao: {type: Date, required: true},
    data_ultima_mod: {type: Date, required: true},
    visibilidade: {type: Boolean, required: true},
    ficheiros: [{type: {
      nome_ficheiro: {type: String, required: true},
      tamanho: {type: String, required: true},
      tipo_mime: {type: String, required: true},
      diretoria: {type: String, required: true}
    }, required: true}]
  });

module.exports = mongoose.model('noticia', noticiaSchema)