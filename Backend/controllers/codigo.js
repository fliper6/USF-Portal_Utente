var Codigo = require('../models/codigo')

// Buscar par email-codigo
module.exports.consultar = email => {
    return Codigo
        .findOne( {email} )
        .exec()
}

module.exports.alterar = par => {
    return Codigo.findOneAndUpdate({email: par.email}, {email: par.email, codigo: par.codigo, createdAt: Date.now()}, {new: true})
}

// Inserir par email-codigo
module.exports.inserir = tk => {
    var novo = new Codigo(tk)
    return novo.save()
}