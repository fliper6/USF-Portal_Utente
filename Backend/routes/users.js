var express = require('express');
var router = express.Router();

const User = require('../controllers/user')
const Blocklist = require('../controllers/blocklist')
const JWTUtils = require('../utils/jwt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const EXPIRES_IN = JWTUtils.EXPIRES_IN
const SECRET = JWTUtils.SECRET

// Obter lista de utilizadores
router.get('/listar', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listarExcetoProprio(req.user._id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de utilizadores (utentes + medicos)
router.get('/listarUsers', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listarUsers()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de utentes
router.get('/listarUtentes', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.listarUtentes()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na listagem de utilizadores."}))
})

// Obter lista de medicos
router.get('/listarMedicos', JWTUtils.validate, JWTUtils.isUtente, (req,res) => {
  User.listarMedicos()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na listagem de utilizadores."}))
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
      {expiresIn: EXPIRES_IN},
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

// Logout (inserir tokens como inválidos, terminar sessão)
router.post('/logout', JWTUtils.validate, (req,res) => {
  Blocklist.inserir({token: req.token, expireAt: new Date(req.user.exp * 1000)}) // *1000 por causa de ser epoch
    .then(dados => res.status(201).jsonp({msg: "Ok. Token adicionado à blocklist"}))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na alteração da blocklist."}))
})

// Mudar nivel de privilegio de um user
router.put('/nivel/:_id', JWTUtils.validate, JWTUtils.isAdmin, (req,res) => {
  User.alterar({ _id: req.params._id, nivel: req.body.nivel})
    .then(dados => res.status(201).jsonp({msg: "Ok. Alterações efetuadas"}))
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na alteração dos privilégios."}))
})

// Alterar password do user
router.put('/alterar/password/:_id', JWTUtils.validate, JWTUtils.compareId, (req,res) => {
  let _id = req.params._id
  let {password_antiga, password_nova} = req.body

  User.consultarID(_id)
    .then(dados => {
      dados 
      ? bcrypt.compare(password_antiga, dados.password, (err, result) => {
        result
        ? bcrypt.hash(password_nova, 10, (err, hash) => {
          password = hash
          if(err) res.status(500).jsonp({error: "Ocorreu um erro na alteração da password."})
          else {
            User.alterar( {_id, password} )
                .then(res.status(201).jsonp({msg: "Palavra-passe alterada com sucesso."}))
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
          }
        })
        : res.status(403).jsonp({error: "A password antiga está incorreta."})
      })
      : res.status(404).jsonp({error: "Utilizador inexistente."})
    })
    .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

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
    .catch(e => res.status(403).jsonp({error: "Ocorreu um erro na alteração dos privilégios."}))
})

module.exports = router;