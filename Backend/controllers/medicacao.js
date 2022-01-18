var Medicacao = require('../models/medicacao')

module.exports.listar = () => {
    return Medicacao
        .find()
        .exec()
}

module.exports.listarPorUser = (id, pagina) => {
    return Medicacao.aggregate([
        {$match: {user: id}},
        {$sort: {data_criacao: -1}},
        {$skip: (pagina-1)*10},
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