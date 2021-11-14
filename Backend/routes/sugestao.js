var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')

let Sugestao = require('../controllers/sugestao')

//Devolve todos as sugestões
router.get('/', JWTUtils.validate ,function(req, res) {
    Sugestao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve uma sugestão de um id especifico
router.get('/:id', JWTUtils.validate , function(req, res) {
    Sugestao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de sugestões de um utente
router.get('/historico/:user', JWTUtils.validate ,function(req, res) {
  Sugestao.listarNrUtente(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

// Inserir uma sugestão
router.post('/', JWTUtils.validate ,function(req, res){
    Sugestao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma sugestão
router.put('/', JWTUtils.validate ,function(req, res){
    Sugestao.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma sugestão
router.delete('/:id', JWTUtils.validate ,function(req, res) {
    Sugestao.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;