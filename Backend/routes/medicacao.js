var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')

let Medicacao = require('../controllers/medicacao')

//Devolve todos os pedidos de medicação
router.get('/', JWTUtils.validate ,function(req, res) {
    Medicacao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de pedidos de medicação de um utente
router.get('/historico/:user', JWTUtils.validate ,function(req, res) {
    Medicacao.listarPorUser(req.params.user)
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