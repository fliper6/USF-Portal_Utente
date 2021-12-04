var Blocklist = require('../models/blocklist')

// Ver se token existe
module.exports.consultar = token => {
    return Blocklist
        .findOne( {token} )
        .exec()
}

// Inserir token
module.exports.inserir = tk => {
    var novo = new Blocklist(tk)
    return novo.save()
}