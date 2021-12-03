const mongoose = require('mongoose')

var ficheiroSchema = new mongoose.Schema({
    nome_ficheiro: {type: String, required: true},
    tamanho: {type: Number, required: true},
    tipo_mime: {type: String, required: true},
    url: {type: String, required: true}
});

module.exports = mongoose.model('ficheiro', ficheiroSchema)