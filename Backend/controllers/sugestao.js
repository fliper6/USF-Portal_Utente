const mongoose = require('mongoose')
var Sugestao = require('../models/sugestao')

module.exports.listar = (estado, skip) => {
    return Sugestao.aggregate([
        {$match: {estado}},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
}

module.exports.listarPorUser = (id, skip) => {
    return Sugestao.aggregate([
        {$match: {user: new mongoose.Types.ObjectId(id)}},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
}

module.exports.consultar = id => {
    return Sugestao
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = sgt => {
    var novo = new Sugestao(sgt)
    return novo.save()
}

module.exports.alterar = sgt => {
    return Sugestao.findByIdAndUpdate({_id: sgt._id}, sgt, {new: true})
}

module.exports.remover = function(id){
    return Sugestao.deleteOne({_id: id})
}