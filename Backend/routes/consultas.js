var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')
let Consulta = require('../controllers/consulta')

//Devolve todos as consultas
router.get('/', JWTUtils.validate, function(req, res) {
    Consulta.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve a consulta de um id especifico
router.get('/:id', JWTUtils.validate, function(req, res) {
  Consulta.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de consultas de um utente
router.get('/historico/:_id', JWTUtils.validate, function(req, res) {
    Consulta.listarPorUser(req.params._id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

// Inserir uma consulta
router.post('/', JWTUtils.validate, function(req, res){
    Consulta.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma consulta
router.put('/', JWTUtils.validate, function(req, res){
    Consulta.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma consulta
router.delete('/:id', JWTUtils.validate, function(req, res) {
    Consulta.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;