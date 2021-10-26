var Noticia = require('../models/Noticia')

module.exports.listar = () => {
    return Noticia
        .find()
        .exec()
}

module.exports.inserir = ctc => {
    var novo = new Noticia(ctc)
    return novo.save()
}

module.exports.alterar = ctc => {
    return Noticia.findByIdAndUpdate({_id: ctc._id}, ctc, {new: true})
}