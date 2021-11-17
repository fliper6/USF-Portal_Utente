var Imagem = require('../models/imagem')

// Inserir nova imagem
module.exports.inserir = img => {
    return new Imagem(img).save()
}

module.exports.remover = urls => {
    return Imagem.deleteMany({url: {$in: urls}})
}