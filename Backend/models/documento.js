const mongoose = require('mongoose')

var documentoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    data_publicacao: {type: String, required: true},
    visibilidade: {type: Boolean, required: true},
    _id_autor: {type: String, required: true},
    nome_autor: {type: String, required: true},
    id_categoria: {type: String, required: true},
    ficheiro: {type: {
        nome_ficheiro: {type: String, required: true},
        tamanho: {type: String, required: true},
        tipo_mime: {type: String, required: true},
        diretoria: {type: String, required: true}
    }, required: true}
});

module.exports = mongoose.model('documento', documentoSchema)