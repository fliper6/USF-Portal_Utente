const mongoose = require('mongoose')

var ficheiroSchema = new mongoose.Schema({
    nome_ficheiro: {type: String, required: true},
    tamanho: {type: Number, required: true},
    tipo_mime: {type: String, required: true},
    diretoria: {type: String, required: true}
});

var documentoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    data_publicacao: {type: String, required: true},
    visibilidade: {type: Boolean, required: true},
    nr_utente_autor: {type: String, required: true},
    nome_autor: {type: String, required: true},
    tipo: {type: [String], required: true},
    ficheiro: {type: ficheiroSchema, required: true}
});

module.exports = mongoose.model('documento', documentoSchema)