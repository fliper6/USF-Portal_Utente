var express = require('express');
var router = express.Router();
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const Email = require('../utils/email')

let Codigo = require('../controllers/codigo')
let User = require('../controllers/user')

// Gerar código para registar email
router.post('/', (req, res) => {
    let codigo = Math.floor(Math.random()*899999+100000);
    let email = req.body.email
    let tipo = 0

    User.consultarEmail(email)
        .then(dados => 
            dados 
            ? res.status(403).jsonp({error: "Este e-mail já se encontra registado."})
            : Codigo.consultar(email, tipo)
                .then(dados => {
                    if(dados){
                        Codigo.alterar({email,codigo,tipo})
                            .then(dados => {
                                Email.sendRegisterConfirmation(email, codigo)
                                    .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                    .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                            })
                            .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."})) 
                    }
                    else {
                        Codigo.inserir( {email, codigo} )
                        .then(dados => {
                            Email.sendRegisterConfirmation(email, codigo)
                                .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."}))
                    }
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

// Verificar se código de registo é válido
router.post('/codigo', (req, res) => {
    let email = req.body.email
    let codigo = req.body.codigo
    let tipo = 0

    Codigo.consultar(email, tipo)
        .then(dados =>
            dados===null
            ? res.status(404).jsonp({error: "Email inválido."})
            : (dados.codigo===codigo) 
            ? res.status(201).jsonp({msg: "Os códigos são iguais."}) 
            : res.status(404).jsonp({error: "Os códigos são distintos."})
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

// Confirmação de alteração de password
router.post('/recuperar/confirmar', (req, res) => {
    let {password, codigo} = req.body
    let tipo = 2
    Codigo.consultarPorCodigo(codigo, tipo)
        .then(dados => {
            dados 
            ? bcrypt.hash(password, 10, (err, hash) => {
                password = hash
                let email = dados.email
                if(err) res.status(500).jsonp({error: "Ocorreu um erro na alteração da password."})
                else {
                    Codigo.remover(codigo)
                        .then(dados => {
                            User.alterarPorEmail( {email, password} )
                                .then(res.status(201).jsonp({msg: "Password alterada com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                }
            })
            : res.status(403).jsonp({msg: "Código de recuperação inválido."})
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

// Enviar um email para recuperar PW
router.post('/recuperar', (req, res) => {
    let codigo = crypto.randomBytes(16).toString('hex')
    let email = req.body.email || 'inv'
    let tipo = 2
    
    User.consultarEmail(email)
        .then(dados => 
            dados === null
            ? res.status(404).jsonp({error: "E-mail inválido."})
            : Codigo.consultar(email,tipo) 
                .then(dados => {
                    dados 
                    ? res.status(403).jsonp({error: "Pedido de recuperação pendente."})
                    : Codigo.inserir({email,codigo,tipo})
                        .then(dados => {
                            Email.sendPasswordReset(email, codigo)
                                .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});


/*
// Gerar código para alterar email
router.post('/email', (req, res) => {
    let codigo = Math.floor(Math.random()*899999+100000);
    let email = req.body.email
    let tipo = 1

    User.consultarEmail(email)
        .then(dados => 
            dados 
            ? res.status(403).jsonp({error: "Este e-mail já se encontra registado."})
            : Codigo.consultar(email, tipo)
                .then(dados => {
                    if(dados){
                        Codigo.alterar({email,codigo,tipo})
                            .then(dados => {
                                Email.send(email, codigo)
                                    .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                    .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                            })
                            .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."})) 
                    }
                    else {
                        Codigo.inserir( {email, codigo, tipo} )
                        .then(dados => {
                            Email.send(email, codigo)
                                .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."}))
                    }
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

router.post('/email/comparar', (req, res) => {
    let email = req.body.email
    let codigo = req.body.codigo
    let tipo = 1
    Codigo.consultar(email, tipo)
        .then(dados =>
            dados===null
            ? res.status(404).jsonp({error: "Email inválido."})
            : (dados.codigo===codigo) 
            ? res.status(201).jsonp({msg: "Os códigos são iguais."}) 
            : res.status(404).jsonp({error: "Os códigos são distintos."})
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});
*/
module.exports = router;