const mongoose = require('mongoose')

var sendgridSchema = new mongoose.Schema({
    key: {type: String, required: true}
  });

module.exports = mongoose.model('sendgrid', sendgridSchema)