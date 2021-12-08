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

// Devolver histórico de sugestões de um utente
router.get('/historico/:_id', JWTUtils.validate ,function(req, res) {
  Sugestao.listarPorUser(req.params._id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve uma sugestão de um id especifico
router.get('/:id', JWTUtils.validate , JWTUtils.compareId , function(req, res) {
    Sugestao.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});


// Inserir uma sugestão
router.post('/', JWTUtils.validate ,function(req, res){
    Sugestao.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.put('/altE', JWTUtils.validate, async (req, res) =>{
    try {
        
        const cos = await Sugestao.alterar(req.body)
        let estado= ""
        req.body.estado==1 ? estado = "aceite" :  estado = "recusada"
        let not= {
            "idReferente": req.body._id,
            "user": req.body.user,
            "descricao": "A sugestão foi "+estado+"!",
            "tipo": 2, 
        }

        const noti = await Notificacao.inserir(not)
            
       
        let socket = req.app.get("socket")
        let usersSockets = req.app.get("usersSockets")
        await socket.broadcast.to(usersSockets[req.body.user]).emit('update notificacoes', noti);
        
        res.status(201).jsonp(noti)
    } catch (error) {
        res.status(500).jsonp({error: e})
    }
    
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