const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../controllers/user'); 

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(
      //{usernameField: 'username'}, (username, password, done) => {
      {usernameField: 'email'}, (email, password, done) => {
        //User.consultar(username, username)
        User.consultarEmail(email)
          .then(dados => {
            const user = dados
            //if(!user) { return done(null, {strat: 'login', success: false, message: 'Combinação inválida de e-mail ou número de utente e/ou password.'})}
            if(!user) { return done(null, {strat: 'login', success: false, message: 'Combinação inválida de e-mail e/ou password.'})}
            bcrypt.compare(password, user.password, function(err, result) {
              if(result) {
                done(null, {strat: 'login', success: true, user})
              }
              else {
                //done(null, {strat: 'login', success: false, message: 'Combinação inválida de e-mail ou número de utente e/ou password.'})
                done(null, {strat: 'login', success: false, message: 'Combinação inválida de e-mail e/ou password.'})
              }
            });
          })
          .catch(e => done(null, {strat: 'login', success: false, message: 'Ocorreu um erro no login de utilizador.' }))
        })
    )

    passport.use('signup', new LocalStrategy(
      //{usernameField: 'nr_utente', passReqToCallback: true}, 
      {usernameField: 'email', passReqToCallback: true}, 
      //(req, nr_utente, password, done) => {
      (req, email, password, done) => {
        //User.consultar(req.body.email, req.body.nr_utente)
        User.consultarEmail(email)
          .then(dados => {
            //if (dados) return done(null, {strat: 'signup', success: false, message: 'E-mail e/ou número de utente já se encontram em uso.'})
            if (dados) return done(null, {strat: 'signup', success: false, message: 'E-mail já se encontra em uso.'})
            else {
              bcrypt.hash(password, 10, function(err, hash) {
                User.inserir({
                  nome: req.body.nome,
                  email: req.body.email, 
                  password: hash,
                  nr_utente: req.body.nr_utente,
                  nr_telemovel: req.body.nr_telemovel,
                  nivel: "Utente",
                  dataRegisto: new Date()
                })
                .then(dados => {
                  return done(null, {strat: 'signup', success: true, user: dados})
                })
                .catch(e => done(null, {strat: 'login', success: false,  message: 'Ocorreu um erro no registo de utilizador.' }))
              });
            }
          })
          .catch(e => done(null, {strat: 'login', success: false,  message: 'Ocorreu um erro no registo de utilizador.' }))
        })
    )

    passport.serializeUser((user,done) => {
      if (user.success) {
        done(null, {strat: user.strat, success: user.success, email: user.user.nr_utente})
      }
      else done(null, user)
    })

  // Desserialização: a partir do id obtem-se a informação do utilizador
    passport.deserializeUser((user, done) => {
      if (user.success) {
        User.consultarNrUtente(user.nr_utente)
          .then(dados => done(null, {success: true, ...dados}))
          .catch(erro => done(erro, false))
      }
      else {
        delete user.strat
        done(null, user)
      }
  })
};