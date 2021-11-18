const mongoose = require('mongoose')

let child = {
  id: {type: String, required: true},
  label: {type: String, required: true},
  children: {type: [this], required: false}
}

var categoriaSchema = new mongoose.Schema({
    categorias: {type: [{
      id: {type: String, required: true},
      label: {type: String, required: true},
      children: {type: [child], required: false}
    }], required: true}
  });

module.exports = mongoose.model('categoria', categoriaSchema)