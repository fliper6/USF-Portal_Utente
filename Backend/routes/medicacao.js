var express = require('express');
var router = express.Router();

let Medicacao = require('../controllers/medicacao')

//Devolve todos os pedidos de medicação
router.get('/', function(req, res) {
    Medicacao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve o pedido de medicação de um id especifico
router.get('/:id', function(req, res) {
  Medicacao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de pedidos de medicação de um utente
router.get('/historico/:nr_utente', function(req, res) {
    Medicacao.listarNrUtente(req.params.nr_utente)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

// Inserir um pedido de medicação
router.post('/', function(req, res){
    Medicacao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um pedido de medicação
router.put('/', function(req, res){
    Medicacao.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover um pedido de medicação
router.delete('/:id', function(req, res) {
    Medicacao.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;