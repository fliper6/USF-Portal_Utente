const mongoose = require('mongoose')

let child = {
  id: {type: String, required: true},
  label: {type: String, required: true},
  children: {type: [this], required: false}
}

var tipoSchema = new mongoose.Schema({
    tipos: {type: [{
      id: {type: String, required: true},
      label: {type: String, required: true},
      children: {type: [child], required: false}
    }], required: true}
  });

module.exports = mongoose.model('tipo', tipoSchema)