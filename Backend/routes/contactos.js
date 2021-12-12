var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')
let Contacto = require('../controllers/contacto')

//Devolve todos as contactos
router.get('/', function(req, res) {
    Contacto.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve a contacto de um id especifico
router.get('/:id', function(req, res) {
  Contacto.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver os contactos para um email
router.get('/:email', function(req, res) {
    Contacto.listarEmail(req.params.email)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

// Inserir uma contacto
router.post('/', JWTUtils.validate, JWTUtils.isAdmin, function(req, res){
    Contacto.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar uma contacto
router.put('/', JWTUtils.validate, JWTUtils.isAdmin, function(req, res){
    Contacto.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover uma contacto
router.delete('/:id', JWTUtils.validate, JWTUtils.isAdmin, function(req, res) {
    Contacto.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;
