var Documento = require('../models/documento')

module.exports.listar = () => {
    return Documento.find({visibilidade: true}).sort('-data_publicacao').exec()
}

module.exports.listarPriv = () => {
    return Documento.find({visibilidade: false}).sort('-data_publicacao').exec()
}


module.exports.consultar = _id => {
    return Documento.findOne({_id}).exec()
}

module.exports.inserir = doc => {
    var novo = new Documento(doc)
    return novo.save()
}

module.exports.remover = _id => {
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: false}})
}

module.exports.adicionar = _id => {
    return Documento.findOneAndUpdate({_id}, {$set: {visibilidade: true}})
}

module.exports.eliminar = function(id){
    return Documento.deleteOne({_id: id})
}