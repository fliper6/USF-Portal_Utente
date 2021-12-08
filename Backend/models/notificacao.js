const mongoose = require('mongoose')

var notificacaoSchema = new mongoose.Schema({
    idReferente: {type: mongoose.Schema.Types.ObjectId,required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user" ,required: true},
    descricao: {type: String, required: true}, 
    tipo: {type: String, required: true}, // Tipo: "0-Agendar consulta médica/1-Pedido de medicação/2-Sugestão"
    estado: {type: Number, required: true, default: 0}, // 0- Não lida, 1- Lida
    data_criacao: {type: Date, default: Date.now, required: true}
  });

module.exports = mongoose.model('notificacao', notificacaoSchema)