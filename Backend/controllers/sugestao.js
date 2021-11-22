var Sugestao = require('../models/sugestao')

module.exports.listar = () => {
    return Sugestao
        .find()
        .exec()
}

module.exports.listarPorUser = id => {
    return Sugestao
        .find({user: id})
        .exec()
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