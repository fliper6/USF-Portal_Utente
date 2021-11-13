var express = require('express');
var router = express.Router();

const User = require('../controllers/user')
const JWTUtils = require('../utils/jwt')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const SECRET = JWTUtils.SECRET

// Validar token (JWT EXPIRATION DATE)
router.get('/validar/:token', (req,res) => {
  jwt.verify(req.params.token,secret,function(e,decoded){
    if(e){
      res.status(404).jsonp({error: "O token é inválido. " + e})
    }
    else res.status(200).jsonp({msg: "Token válido."})
  }) 
})

// Buscar info de um user
router.get('/info/:nr_utente', JWTUtils.validate, (req,res) => {
  if(req.user.nr_utente === req.params.nr_utente){
    res.status(200).jsonp(req.user)
  }
  else{
    res.status(403).jsonp({erro: "Não tem acesso à operação."})
  }
})

// Login de um user, retorna token
router.post('/login', passport.authenticate('login'), (req,res) => {
  if (req.user.success) {
    jwt.sign({
      nome: req.user.user.nome,
      email: req.user.user.email, 
      nr_utente: req.user.user.nr_utente,
      nr_telemovel: req.user.user.nr_telemovel,
      nivel: req.user.user.nivel,
      sub: 'PORTAL_UTENTE_2021'}, 
      SECRET,
      {expiresIn: "1m"},
      function(e, token) {
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token})
    })
  }
  else res.status(500).jsonp({error: req.user.message}) 
})

// Registar user
router.post('/registar', passport.authenticate('signup'), (req,res) => {
  if (req.user.success) {
    res.status(201).jsonp(req.user.user) 
  }
  else res.status(500).jsonp({error: req.user.message}) 
})

// Logout (blacklist)
router.post('/logout', (req,res) => {
  res.send(req.body)
})

// Aumentar nivel de privilegio de um user para medico
router.put('/nivel/:nr_utente', (req,res) => {
  User.alterar({ nr_utente: req.params.nr_utente, nivel: "medico"})
    .then(dados => res.status(200).jsonp({msg: "Ok. Alterações efetuadas"}))
    .catch(e => {console.log(e); res.status(403).jsonp({erro: "Ocorreu um erro na alteração dos privilégios."})})
})

module.exports = router;