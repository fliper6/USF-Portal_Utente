var TipoDocumento = require('../models/tipo_documento')

// lista os tipos
module.exports.listar = () => {
    return TipoDocumento.findOne({}, {_id: 0, tipos: 1})
}

module.exports.atualizar = tipos => {
    return TipoDocumento.findOneAndUpdate({}, {$set: {tipos}}, {upsert:true, returnNewDocument: true});
}