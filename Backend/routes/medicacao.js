var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')
let Notificacao = require('../controllers/notificacao');

let Medicacao = require('../controllers/medicacao')

//Devolve todos os pedidos de medicação
router.get('/', JWTUtils.validate ,function(req, res) {
    Medicacao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de pedidos de medicação de um utente
router.get('/historico/:_id', JWTUtils.validate , JWTUtils.compareId, function(req, res) {
    Medicacao.listarPorUser(req.params._id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

//Devolve o pedido de medicação de um id especifico
router.get('/:id', JWTUtils.validate ,function(req, res) {
  Medicacao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});


// Inserir um pedido de medicação
router.post('/', JWTUtils.validate ,function(req, res){
    Medicacao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//Aceitar ou recusar pedido de medicação
router.put('/altE', JWTUtils.validate, async (req, res) =>{
    try {
        
        const cos = await Medicacao.alterar(req.body)
        let estado= ""
        req.body.estado==1 ? estado = "aceite" :  estado = "recusado"
        let not= {
            "idReferente": req.body._id,
            "user": req.body.user,
            "descricao": "O seu pedido de medicação foi "+estado+"!",
            "tipo": "pedidoMedicacao", 
        }

        const noti = await Notificacao.inserir(not)
            
        
        let socket = req.app.get("socket")
        let usersSockets = req.app.get("usersSockets")
        await socket.broadcast.to(usersSockets[req.body.user]).emit('update notificacoes', noti);
       
        res.status(201).jsonp(noti)
    } catch (error) {
        res.status(500).jsonp({error: error})
    }
    
})


// Alterar um pedido de medicação
router.put('/', JWTUtils.validate ,function(req, res){
    Medicacao.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover um pedido de medicação
router.delete('/:id', JWTUtils.validate ,function(req, res) {
    Medicacao.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;