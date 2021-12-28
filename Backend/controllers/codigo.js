var Codigo = require('../models/codigo')

// Buscar par email-codigo
module.exports.consultar = (email, tipo) => {
    return Codigo
        .findOne( {email, tipo} )
        .exec()
}

module.exports.consultarPorCodigo = (codigo, tipo) => {
    return Codigo
            .findOne( {codigo, tipo} )
            .exec()
}

module.exports.alterar = par => {
    return Codigo.findOneAndUpdate({email: par.email}, {email: par.email, codigo: par.codigo, tipo: par.tipo, createdAt: Date.now()}, {new: true})
}

module.exports.remover = codigo => {
    return Codigo.deleteOne({codigo})
}

// Inserir par email-codigo
module.exports.inserir = tk => {
    var novo = new Codigo(tk)
    return novo.save()
}