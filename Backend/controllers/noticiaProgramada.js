var NoticiaProg = require('../models/noticiaProgramada')

module.exports.listar = () => {
    return NoticiaProg.find().exec()
}

module.exports.listarIDs = () => {
    return NoticiaProg.find({'noticia.id_original': { $exists: true } }, {_id: 0, 'noticia.id_original': 1}).exec()
}

module.exports.consultar = _id => {
    return NoticiaProg.findOne({_id}).exec()
}

module.exports.inserir = np => {
    var novo = new NoticiaProg(np)
    return novo.save()
}

module.exports.atualizar = np => {
    return NoticiaProg.findByIdAndUpdate({_id: np._id}, np, {new: true})
}

module.exports.remover = _id => {
    return NoticiaProg.deleteOne({_id})
}