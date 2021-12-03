var Ficheiro = require('../models/ficheiro')

// Inserir novo ficheiro
module.exports.inserir = img => {
    return new Ficheiro(img).save()
}

module.exports.remover = urls => {
    return Ficheiro.deleteMany({url: {$in: urls}})
}