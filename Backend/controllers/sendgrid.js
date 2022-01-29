var Sendgrid = require('../models/sendgrid')

// Ver se token existe
module.exports.consultar = () => {
    return Sendgrid
        .findOne()
        .exec()
}

module.exports.alterar = key => {
    return Sendgrid.updateOne({}, {key})
}
