var express = require('express');
var router = express.Router();

const Email = require('../utils/email')

let Codigo = require('../controllers/codigo')
let User = require('../controllers/user')

// Gerar código para email
router.post('/', (req, res) => {
    let codigo = Math.floor(Math.random()*899999+100000);
    let email = req.body.email

    User.consultarEmail(email)
        .then(dados => 
            dados 
            ? res.status(403).jsonp({error: "Este e-mail já se encontra registado."})
            : Codigo.consultar(email)
                .then(dados => {
                    if(dados){
                        Codigo.alterar({email,codigo})
                            .then(dados => {
                                Email.send(email, codigo)
                                    .then(dados => res.status(201).jsonp({msg: "Ok. E-mail enviado com sucesso."}))
                                    .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no envio do e-mail."}))
                            })
                            .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."})) 
                    }
                    else {
                        Codigo.inserir( {email, codigo} )
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

// Verificar se código é válido
router.post('/codigo', (req, res) => {
    let email = req.body.email
    let codigo = req.body.codigo
    Codigo.consultar(email)
        .then(dados =>
            dados===null
            ? res.status(404).jsonp({error: "Email inválido."})
            : (dados.codigo===codigo) 
            ? res.status(201).jsonp({msg: "Os códigos são iguais."}) 
            : res.status(404).jsonp({error: "Os códigos são distintos."})
        )
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro no acesso à base de dados."}))
});

module.exports = router;