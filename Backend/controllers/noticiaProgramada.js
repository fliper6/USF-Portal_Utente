var NoticiaProg = require('../models/noticiaProgramada')

module.exports.listar = () => {
    return NoticiaProg.find().exec()
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