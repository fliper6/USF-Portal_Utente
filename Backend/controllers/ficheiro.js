var Ficheiro = require('../models/ficheiro')

module.exports.inserir = f => {
    return new Ficheiro(f).save()
}