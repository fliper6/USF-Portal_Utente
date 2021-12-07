var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')
let Consulta = require('../controllers/consulta')
let Notificacao = require('../controllers/notificacao')

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
router.put('/altE', JWTUtils.validate, function(req, res){
    Consulta.alterar(req.body)
    .then(dados =>{
        let estado= ""
        req.body.estado ? estado = "aceite" :  estado = "recusada"

        let not= {
            "idReferente": req.body._id,
            "user": req.body.user,
            "descricao": "O estado da sua consulta foi "+estado+"!",
            "tipo": 0, 
        }
        Notificacao.inserir(not)
        .then(dadosN =>{
            try {
                let socket = req.app.get("socket")
                let usersSockets = req.app.get("usersSockets")
        
                console.log("testttt "+req.body.user+" socket: "+usersSockets[req.body.user])
        
                socket.broadcast.to(usersSockets[req.body.user]).emit('update notificacoes', "toma toma cao");
                console.log("ttestetetwetrw")
            } catch (error) {
                res.status(500).jsonp({error: e})
            }
            res.status(201).jsonp(dados)
            } 
        )
        .catch(e => res.status(500).jsonp({error: e}))
        
        }
    )
    .catch(e => res.status(404).jsonp({error: e}))
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