var Contacto = require('../models/contacto')

module.exports.listar = () => {
    return Contacto
        .find()
        .exec()
}

module.exports.inserir = ctc => {
    var novo = new Contacto(ctc)
    return novo.save()
}

module.exports.alterar = ctc => {
    return User.findByIdAndUpdate({_id: ctc._id}, ctc, {new: true})
}