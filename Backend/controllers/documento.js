var Documento = require('../models/documento')

module.exports.listar = () => {
    return Documento
        .find()
        .exec()
}

module.exports.inserir = doc => {
    var novo = new Documento(doc)
    return novo.save()
}

module.exports.remover = _id => {
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: false}})
}