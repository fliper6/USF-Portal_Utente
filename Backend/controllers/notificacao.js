var Notificacao = require('../models/notificacao')

module.exports.listar = () => {
    return Notificacao
        .find()
        .exec()
}

module.exports.listarPorUser = nr => {
    return Notificacao
        .find({user: nr})
        .sort({"data_criacao":-1})
        .exec()
}

module.exports.consultar = id => {
    return Notificacao
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = con => {
    var novo = new Notificacao(con)
    return novo.save()
}

module.exports.alterar = con => {
    return Notificacao.findByIdAndUpdate({_id: con._id}, con, {new: true})
}

module.exports.remover = function(id){
    return Notificacao.deleteOne({_id: id})
}