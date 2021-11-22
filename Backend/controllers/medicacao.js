var Medicacao = require('../models/medicacao')

module.exports.listar = () => {
    return Medicacao
        .find()
        .exec()
}

module.exports.listarPorUser = id => {
    return Medicacao
        .find({user: id})
        .exec()
}

module.exports.consultar = id => {
    return Medicacao
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = med => {
    var novo = new Medicacao(med)
    return novo.save()
}

module.exports.alterar = med => {
    return Medicacao.findByIdAndUpdate({_id: med._id}, med, {new: true})
}

module.exports.remover = function(id){
    return Medicacao.deleteOne({_id: id})
}