var Medico = require('../models/medico')

module.exports.listar = () => {
    return Medico
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Medico
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = med => {
    var novo = new Medico(med)
    return novo.save()
}

module.exports.alterar = med => {
    return Medico.findByIdAndUpdate({_id: med._id}, med, {new: true})
}

module.exports.remover = function(id){
    return Medico.deleteOne({_id: id})
}