var Equipa = require('../models/equipa')

module.exports.listar = () => {
    return Equipa
        .find()
        .exec()
}

module.exports.inserir = ctc => {
    var novo = new Equipa(ctc)
    return novo.save()
}
