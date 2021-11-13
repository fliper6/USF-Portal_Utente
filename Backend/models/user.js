const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    nr_utente: {type: String, required: true},
    nr_telemovel: {type: Number, required: true},
    nivel: {type: String, required: true} // utente, medico, admin
  });

module.exports = mongoose.model('user', userSchema)