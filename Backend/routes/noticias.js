var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt')

let Ficheiro = require('../controllers/ficheiro')


router.post('/imagem', /* JWTUtils.validate, JWTUtils.isMedico, */ upload.single('imagem'), (req,res) => {
    let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
    let nova_diretoria = (__dirname + 'public/fileStore/noticias/' + Date.now() + "-" + req.file.originalname).replace("routes","").replace(/\\/g, "/");

    fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })

    let ficheiro = {
        nome_ficheiro: req.file.originalname,
        tamanho: req.file.size,
        tipo_mime: req.file.mimetype,
        diretoria: "public" + nova_diretoria.split("public")[1]
    }

    Ficheiro.inserir(ficheiro)
        .then(dados => res.status(200).jsonp({url: ficheiro.diretoria}))
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao inserir a imagem ${ficheiro.nome_ficheiro}.`}))
})

module.exports = router;