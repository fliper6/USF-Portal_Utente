var mongoose = require('mongoose');
const cfg = require('../../config.json')

const CONNECTION_STRING = cfg.mongo + '/USF_PORTAL_UTENTE'

mongoose.connect(CONNECTION_STRING, 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB.'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso.")
});