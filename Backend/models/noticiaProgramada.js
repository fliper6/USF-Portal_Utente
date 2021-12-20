const mongoose = require('mongoose')

var noticiaProgramadaSchema = new mongoose.Schema({
    recorrencia: {type: [Number], required: true},
    data_pub: {type: String, required: true},
    id_original: {type: mongoose.Schema.Types.ObjectId, ref: "noticia", required: false},
    noticia: {   
        titulo: {type: String, required: true}, 
        corpo: {type: String, required: true},
        _id_autor: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
        nome_autor: {type: String, required: true},
        data_criacao: {type: String, required: true},
        data_ultima_mod: {type: String, required: true},
        visibilidade: {type: Number, required: true},
        original: {type: Boolean, required: true},
        ficheiros: [{type: {
            nome_ficheiro: {type: String, required: true},
            tamanho: {type: String, required: true},
            tipo_mime: {type: String, required: true},
            diretoria: {type: String, required: true}
        }, required: true}]
    }
});

module.exports = mongoose.model('noticiaProgramada', noticiaProgramadaSchema)