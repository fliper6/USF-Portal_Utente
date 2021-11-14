var Consulta = require('../models/consulta')

module.exports.listar = () => {
    return Consulta
        .find()
        .exec()
}

module.exports.listarNrUtente = nr => {
    return Consulta
        .find({nr_utente_titular: nr})
        .exec()
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