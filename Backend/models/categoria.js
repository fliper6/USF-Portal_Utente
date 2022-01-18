const mongoose = require('mongoose')

let child = {
  id: {type: String, required: true},
  label: {type: String, required: true},
  removed: {type: Boolean, required: true},
  children: {type: [this], required: true, default: []}
}

var categoriaSchema = new mongoose.Schema({
    categorias: {type: [{
      id: {type: String, required: true},
      label: {type: String, required: true},
      removed: {type: Boolean, required: true},
      children: {type: [child], required: true, default: []}
    }], required: true}
  });

module.exports = mongoose.model('categoria', categoriaSchema)