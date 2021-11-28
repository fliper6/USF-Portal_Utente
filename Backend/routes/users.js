var express = require('express');
var router = express.Router();

const User = require('../controllers/user')
const JWTUtils = require('../utils/jwt')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const SECRET = JWTUtils.SECRET

// Obter lista de utilizadores
router.get('/listar', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listar()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de utilizadores (utentes + medicos)
router.get('/listarUsers', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listarUsers()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de utentes
router.get('/listarUtentes', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listarUtentes()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de medicos
router.get('/listarMedicos', JWTUtils.validate, JWTUtils.isUtente, (req,res) => {
  User.listarMedicos()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na listagem de utilizadores."}))
})

// Validar token (JWT EXPIRATION DATE)
router.get('/validar/:token', (req,res) => {
  jwt.verify(req.params.token,SECRET,function(e,decoded){
    if(e){
      res.status(404).jsonp({error: "O token é inválido. " + e})
    }
    else res.status(200).jsonp({msg: "Token válido."})
  }) 
})

// SEMI WIP
// Buscar info de um user
router.get('/info/:_id', JWTUtils.validate, JWTUtils.compareId, (req,res) => {
    res.status(200).jsonp(req.user)
})

// Login de um user, retorna token
router.post('/login', passport.authenticate('login'), (req,res) => {
  if (req.user.success) {
    jwt.sign({
      _id: req.user.user._id,
      nome: req.user.user.nome,
      email: req.user.user.email, 
      nr_utente: req.user.user.nr_utente,
      nr_telemovel: req.user.user.nr_telemovel,
      nivel: req.user.user.nivel,
      dataRegisto: req.user.user.dataRegisto,
      sub: 'PORTAL_UTENTE_2021'}, 
      SECRET,
      {expiresIn: "4h"},
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

// WIP
// Logout (blacklist)
router.post('/logout', (req,res) => {
  res.send(req.body)
})

// Mudar nivel de privilegio de um user
router.put('/nivel/:_id', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.alterar({ _id: req.params._id, nivel: req.body.nivel})
    .then(dados => res.status(201).jsonp({msg: "Ok. Alterações efetuadas"}))
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na alteração dos privilégios."}))
})

// Alterar utilizador
router.put('/alterar/:_id', JWTUtils.validate, JWTUtils.compareId, (req,res) => {
  if(!req.body._id) req.body._id = req.params._id 
  User.alterar(req.body)
    .then(dados => {
      jwt.sign({
        _id: dados._id,
        nome: dados.nome,
        email: dados.email, 
        nr_utente: dados.nr_utente,
        nr_telemovel: dados.nr_telemovel,
        nivel: dados.nivel,
        dataRegisto: dados.dataRegisto,
        sub: 'PORTAL_UTENTE_2021'}, 
        SECRET,
        {expiresIn: "4h"},
        function(e, token) {
          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
          else res.status(201).jsonp({token})
      })
    })
    .catch(e => res.status(403).jsonp({erro: "Ocorreu um erro na alteração dos privilégios."}))
})

module.exports = router;