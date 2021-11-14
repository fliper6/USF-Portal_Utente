var Documento = require('../models/documento')

module.exports.listar = () => {
    return Documento
        .find()
        .exec()
}

module.exports.inserir = docs => {
    return Documento.insertMany(docs)
}

module.exports.remover = _id => {
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: false}})
}