var router = require("express-promise-router")();

const JWTUtils = require('../utils/jwt')
let Consulta = require('../controllers/consulta')
let Notificacao = require('../controllers/notificacao');
const { notify } = require("./users");

//Devolve todos os pedidos de contacto
router.get('/', JWTUtils.validate, function(req, res) {
    Consulta.listar()
    .then(dados => res.status(200).jsonp(dados)) 
    .catch(e => res.status(404).jsonp({error: e}))
});

//Devolve o pedido de contacto de um id especifico
router.get('/:id', JWTUtils.validate, function(req, res) {
  Consulta.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados) )
    .catch(e => res.status(404).jsonp({error: e}))
});

// Devolver histórico pedidos de contacto de um utente
router.get('/historico/:_id', JWTUtils.validate, function(req, res) {
    Consulta.listarPorUser(req.params._id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(404).jsonp({error: e}))
  });

// Inserir um pedido de contacto
router.post('/', JWTUtils.validate, function(req, res){
    Consulta.inserir(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//Aceitar ou recusar pedido de contacto
router.put('/altE', JWTUtils.validate, async (req, res) =>{
    try {
        
        const cos = await Consulta.alterar(req.body)
        let estado= ""
        req.body.estado==1 ? estado = "aceite" :  estado = "recusado"
        let not= {
            "idReferente": req.body._id,
            "user": req.body.user,
            "descricao": "O seu pedido de contacto foi "+estado+"!",
            "tipo": "pedidoContacto", 
        }

        const noti = await Notificacao.inserir(not)
            
        
        let socket = req.app.get("socket")
        let usersSockets = req.app.get("usersSockets")
        await socket.broadcast.to(usersSockets[req.body.user]).emit('update notificacoes', noti);
       
        res.status(201).jsonp(noti)
    } catch (error) {
        res.status(500).jsonp({error: error})
    }
    
})

// Alterar um pedido de contacto
router.put('/', JWTUtils.validate, function(req, res){
    Consulta.alterar(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
})

// Remover um pedido de contacto
router.delete('/:id', JWTUtils.validate, function(req, res) {
    Consulta.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;