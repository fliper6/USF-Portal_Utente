const mongoose = require('mongoose')
var Consulta = require('../models/consulta')

module.exports.listar = (estado, ordem, skip) => {
    let match = !estado ? {estado: 0} : {$or: [{estado: 1}, {estado: 2}]}
    
    return Consulta.aggregate([
        {$match: match},
        {$sort: {data_criacao: ordem}},
        {$skip: skip},
        {$limit: 10}
    ])
}
module.exports.listarPorUser = (id, skip) => {
    return Consulta.aggregate([
        {$match: {user: new mongoose.Types.ObjectId(id)}},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
}

module.exports.consultar = id => {
    return Consulta
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = con => {
    var novo = new Consulta(con)
    return novo.save()
}

module.exports.alterar = con => {
    return Consulta.findByIdAndUpdate({_id: con._id}, con, {new: true})
}

module.exports.remover = function(id){
    return Consulta.deleteOne({_id: id})
}