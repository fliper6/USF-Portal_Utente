var express = require('express');
var router = express.Router();
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const Email = require('../utils/email')
const JWTUtils = require('../utils/jwt')

let Codigo = require('../controllers/codigo')
let User = require('../controllers/user')
let Swap = require('../controllers/swap')

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
            : res.status(403).jsonp({error: "Código de recuperação inválido."})
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
            ? res.status(404).jsonp({error: "E-mail sem conta associada."})
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

// Confirmação de alteração de email
router.post('/email/confirmar', (req, res) => {
    let codigo = req.body.codigo
    
    Swap.consultar(codigo)
        .then(dados => {
            dados === null
            ? res.status(403).jsonp({error: "Código de confirmação inválido."})
            : dados.estado === 1
            ? res.status(403).jsonp({error: "Já foi confirmada a mudança de e-mail anteriormente."})
            : dados.estado === 2
            ? res.status(403).jsonp({error: "Não é possível confirmar a mudança de e-mail devido a ter sido cancelada."})
            : Swap.alterar(codigo, { estado: 1 })
                .then(dados => {
                    User.alterar({_id: dados.idUser, email: dados.email_novo})
                        .then(dados => {
                            Codigo.remover(codigo)
                                .then(dados => res.status(201).jsonp({msg: "E-mail alterado com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                        })
                        .catch(e => {res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."})})
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

// Cancelar alteração de email
router.post('/email/cancelar', (req, res) => {
    let codigo = req.body.codigo
    
    Swap.consultar(codigo)
        .then(dados => {
            dados === null
            ? res.status(403).jsonp({error: "Código de confirmação inválido."})
            : dados.estado === 2
            ? res.status(403).jsonp({error: "O e-mail já foi revertido com sucesso."})
            : Swap.alterar(codigo, { estado: 2 })
                .then(dados => {
                    User.alterar({_id: dados.idUser, email: dados.email_antigo})
                        .then(dados => {
                            Codigo.remover(codigo)
                                .then(dados => res.status(201).jsonp({msg: "E-mail revertido com sucesso."}))
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

// Gerar código para alterar email
router.post('/email/:_id', JWTUtils.validate, JWTUtils.compareId, (req, res) => {
    let codigo = crypto.randomBytes(16).toString('hex')
    let email_novo = req.body.email 
    let email_antigo = req.user.email
    let email = email_antigo
    let idUser = req.user._id
    let tipo = 1
    let estado = 0

    if(email_antigo === email_novo) res.status(403).jsonp({error: "Insira um e-mail diferente do atual."})

    User.consultarEmail(email_novo)
        .then(dados => {
            dados
            ? res.status(403).jsonp({error: "Este e-mail já tem conta associada."}) // email repetido ou nao
            : Codigo.consultar(email_antigo,tipo) 
                .then(dados => {
                    dados // pedido pendente ou nao
                    ? res.status(403).jsonp({error: "Pedido de alteração de e-mail pendente."}) 
                    : Swap.consultarPorId(req.user._id) 
                        .then(dados => {
                            let swapData = dados
                            dados === null // se não existe um pedido da mesma conta não pendente 
                            ? Codigo.inserir({email,codigo,tipo})
                                .then(dados => {
                                    Swap.inserir({idUser, codigo, email_antigo, email_novo})
                                        .then(dados => { 
                                            Email.sendEmailCancel(email_antigo, codigo)
                                                .then(dados => {
                                                    Email.sendEmailConfirmation(email_novo, codigo)
                                                        .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."})) 
                                                })
                                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."})) 
                                        })
                                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                                })
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                            : swapData.estado === 0 || swapData.estado === 2 // recusado ou pendente
                            ? Codigo.inserir({email,codigo,tipo})
                                .then(dados => {
                                    let createdAt = Date.now()
                                    Swap.alterar(swapData.codigo, {codigo, email_novo, estado, createdAt})
                                        .then(dados => {
                                            Email.sendEmailCancel(email_antigo, codigo)
                                                .then(dados => {
                                                    Email.sendEmailConfirmation(email_novo, codigo)
                                                        .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."})) 
                                                })
                                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."})) 
                                        }) 
                                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                                })
                                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
                            : res.status(403).jsonp({error: "Necessita de esperar 7 dias para alterar o e-mail novamente."})  
                        })
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
            })
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

module.exports = router;