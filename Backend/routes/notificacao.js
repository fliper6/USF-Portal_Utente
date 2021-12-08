var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')
let Notificacao = require('../controllers/notificacao')

//Devolve todos as consultas
router.get('/', JWTUtils.validate, function(req, res) {
    Notificacao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve a consulta de um id especifico
router.get('/:id', JWTUtils.validate, function(req, res) {
    Notificacao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de consultas de um utente
router.get('/PorUser/:user', JWTUtils.validate, function(req, res) {
    Notificacao.listarPorUser(req.params.user)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
});

// Inserir uma consulta
router.post('/', JWTUtils.validate, function(req, res){
    Notificacao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma consulta
router.put('/lidas/:user',   function(req, res){
    Notificacao.todasLidas(req.params.user,2)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Alterar uma consulta
router.put('/recebidas/:user',   function(req, res){
    Notificacao.recebidas(req.params.user,1)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})


// Alterar uma consulta
router.put('/', JWTUtils.validate, function(req, res){
    Notificacao.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma consulta
router.delete('/all/:user',JWTUtils.validate, function(req, res) {
    Notificacao.removerAll(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

// Remover uma consulta
router.delete('/:id', JWTUtils.validate, function(req, res) {
    Notificacao.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;