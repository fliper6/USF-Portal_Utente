var Categoria = require('../models/categoria')

// lista as categorias
module.exports.listar = () => {
    return Categoria.findOne({}, {_id: 0, categorias: 1})
}

module.exports.atualizar = categorias => {
    return Categoria.findOneAndUpdate({}, {$set: {categorias}}, {upsert: true, new: true});
}