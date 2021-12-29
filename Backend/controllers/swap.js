var Swap = require('../models/swap')

// Buscar informaçao de um swap de email dado codigo
module.exports.consultar = codigo => {
    return Swap
        .findOne( {codigo} )
        .exec()
}

module.exports.consultarPorId = idUser => {
    return Swap
        .findOne( {idUser} )
        .exec()
}

module.exports.alterar = (codigo, swap) => {
    return Swap.findOneAndUpdate(
        {codigo},
        swap,
        {new:true}
    )
}

module.exports.remover = codigo => {
    return Swap.deleteOne({codigo})
}

// Inserir um pedido de swap de email
module.exports.inserir = tk => {
    var novo = new Swap(tk)
    return novo.save()
}