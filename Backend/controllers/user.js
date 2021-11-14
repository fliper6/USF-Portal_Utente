var User = require('../models/user')

module.exports.listar = () => {
    return User
        .find()
        .sort('nome')
        .exec()
}

module.exports.listarUsers = () => {
    return User
        .find({nivel: {$not: {$eq: 'admin'}} }, {password: 0, _id: 0, __v: 0})
        .sort('nome') // ou -nome para descending
        .exec()
}

module.exports.listarUtentes = () => {
    return User
        .find({nivel: 'utente'}, {password: 0, _id: 0, __v: 0, nivel: 0})
        .sort('nome') // ou -nome para descending
        .exec()
}

module.exports.consultar = (email, nr_utente) => {
    return User
        .findOne( {$or: [ {email}, {nr_utente} ]} )
        .exec()
}

module.exports.consultarEmail = email => {
    return User
        .findOne({email})
        .exec()
}

module.exports.consultarNrUtente = nr_utente => {
    return User
        .findOne({nr_utente})
        .exec()
}

module.exports.consultarMuitos = ids => {
    return User
        .find({_id: {$in: ids}}, {nome: 1})
        .exec()
}

module.exports.inserir = user => {
    var novo = new User(user)
    return novo.save()
}

module.exports.remover = email => {
    return User.deleteOne({email})
}

module.exports.alterar = user => {
    return User.findOneAndUpdate({_id: user._id}, user, {new: true})
}