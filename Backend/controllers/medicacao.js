const mongoose = require('mongoose')
var Medicacao = require('../models/medicacao')

module.exports.listar = (estado, skip) => {
    let match = !estado ? {estado: 0} : {$or: [{estado: 1}, {estado: 2}]}
    
    return Medicacao.aggregate([
        {$match: match},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
}

module.exports.listarPorUser = (id, skip) => {
    return Medicacao.aggregate([
        {$match: {user: new mongoose.Types.ObjectId(id)}},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
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