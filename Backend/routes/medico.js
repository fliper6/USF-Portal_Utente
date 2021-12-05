var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')

let Medico = require('../controllers/medico')

//Devolve todos os medicos
router.get('/', JWTUtils.validate ,function(req, res) {
    Medico.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve o medico de um id especifico
router.get('/:id', JWTUtils.validate ,function(req, res) {
  Medico.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Inserir um medico
router.post('/', JWTUtils.validate , JWTUtils.isAdmin, function(req, res){
    Medico.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um medico
router.put('/', JWTUtils.validate , JWTUtils.isAdmin, function(req, res){
    Medico.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover um medico
router.delete('/:id', JWTUtils.validate , JWTUtils.isAdmin, function(req, res) {
    Medico.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;