var express = require('express');
var router = express.Router();

let Consulta = require('../controllers/consulta')

//Devolve todos as consultas
router.get('/', function(req, res) {
    Consulta.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve a consulta de um id especifico
router.get('/:id', function(req, res) {
  Consulta.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de consultas de um utente
router.get('/historico/:nr_utente', function(req, res) {
    Consulta.listarNrUtente(req.params.nr_utente)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

// Inserir uma consulta
router.post('/', function(req, res){
    Consulta.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma consulta
router.put('/', function(req, res){
    Consulta.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma consulta
router.delete('/:id', function(req, res) {
    Consulta.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;