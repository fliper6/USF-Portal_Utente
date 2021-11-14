var Contacto = require('../models/contacto')

module.exports.listar = () => {
    return Contacto
        .find()
        .exec()
}

module.exports.listarEmail = em => {
    return Contacto
        .find({email: em})
        .exec()
}

module.exports.consultar = id => {
    return Contacto
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = ctc => {
    var novo = new Contacto(ctc)
    return novo.save()
}

module.exports.alterar = ctc => {
    return Contacto.findByIdAndUpdate({_id: ctc._id}, ctc, {new: true})
}

module.exports.remover = function(id){
    return Contacto.deleteOne({_id: id})
}