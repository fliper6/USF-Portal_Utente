var Noticia = require('../models/Noticia')

module.exports.listar = (skip, visibilidade) => {
    return Noticia.aggregate([
        {$match: {visibilidade}},
        {$sort: {data_criacao: -1}},
        {$skip: skip},
        {$limit: 10}
    ])
}

module.exports.listarOriginais = ids_originais => {
    return Noticia.find({
        visibilidade: 0,
        id_original: { $exists: false },
        _id: { $nin: ids_originais }
    }).sort('-data_criacao').exec()
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

module.exports.alterarVisibilidade = (_id, visibilidade) => {
    return Noticia.findOneAndUpdate({_id}, {$set: {visibilidade: visibilidade}}, {new: true})
}