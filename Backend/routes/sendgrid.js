var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt')

let Sendgrid = require('../controllers/sendgrid')

function hide(key) {
    let value1 = 9
    let value2 = key.length - 8
    var i = 0
    var k = ""
    while(i<key.length) {
      (value1<i && i<value2) ? k+="•" : k += key[i]
      i++
    }
    return k
} 

//Devolve todos os medicos
router.get('/', JWTUtils.validate, JWTUtils.isAdmin, function(req, res) {
    Sendgrid.consultar()
        .then(dados => {
            dados 
            ? res.status(200).jsonp({key: hide(dados.key)})
            : res.status(500).jsonp({error: "Ocorreu um erro na base de dados."})
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."}))
});

// Alterar o codigo sendgrid
router.put('/', JWTUtils.validate , JWTUtils.isAdmin, function(req, res){
    let key = req.body.key
    Sendgrid.alterar(key)
        .then(dados => res.status(201).jsonp({msg: "API Key do SendGrid alterada com sucesso."}))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro na base de dados."}))
})
module.exports = router;