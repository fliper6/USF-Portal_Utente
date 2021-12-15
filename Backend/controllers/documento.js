var Documento = require('../models/documento')

module.exports.listar = visibilidade => {
    return Documento.find({visibilidade}).sort('-data_publicacao').exec()
}

module.exports.consultar = _id => {
    return Documento.findOne({_id}).exec()
}

module.exports.inserir = doc => {
    var novo = new Documento(doc)
    return novo.save()
}

module.exports.remover = _id => {
    console.log(_id)
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: "1"}})
}

module.exports.adicionar = _id => {
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: "0"}})
}

module.exports.eliminar = function(id){
    return Documento.deleteOne({_id: id})
}