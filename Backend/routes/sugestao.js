var express = require('express');
var router = express.Router();

let Sugestao = require('../controllers/sugestao')

//Devolve todos as sugestões
router.get('/', function(req, res) {
    Sugestao.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve uma sugestão de um id especifico
router.get('/:id', function(req, res) {
    Sugestao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico de sugestões de um utente
router.get('/historico/:nr_utente', function(req, res) {
  Sugestao.listarNrUtente(req.params.nr_utente)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

// Inserir uma sugestão
router.post('/', function(req, res){
    Sugestao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma sugestão
router.put('/', function(req, res){
    Sugestao.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma sugestão
router.delete('/:id', function(req, res) {
    Sugestao.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;