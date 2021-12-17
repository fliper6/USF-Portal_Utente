const mongoose = require('mongoose')

var equipaSchema = new mongoose.Schema({
    id: Number,
  });

module.exports = mongoose.model('equipa', equipaSchema)
