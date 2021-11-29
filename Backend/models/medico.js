const mongoose = require('mongoose')

var medicoSchema = new mongoose.Schema({    
    nome: String
  });

module.exports = mongoose.model('medico', medicoSchema)