var Noticia = require('../models/Noticia')

module.exports.listar = () => {
    return Noticia.find().exec()
}

module.exports.consultar = _id => {
    return Noticia.findOne({_id}).exec()
}

module.exports.inserir = not => {
    var novo = new Noticia(not)
    return novo.save()
}

module.exports.atualizar = not => {
    return Noticia.findByIdAndUpdate({_id: not._id}, not, {new: true})
}

module.exports.remover = _id => {
    return Noticia.findOneAndUpdate({_id}, {$set: {visibilidade: false}})
}