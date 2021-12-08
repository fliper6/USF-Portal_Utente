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

module.exports.todasLidas = user => {
    return Notificacao.updateMany({user: user}, {estado: 2}, {new: true})
}

module.exports.alterar = con => {
    return Notificacao.findByIdAndUpdate({_id: con._id}, con, {new: true})
}

module.exports.remover = function(id){
    return Notificacao.deleteOne({_id: id})
}

module.exports.removerAll = function(user){
    return Notificacao.deleteMany({user: user})
}