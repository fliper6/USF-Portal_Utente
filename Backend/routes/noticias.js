var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt')

let Imagem = require('../controllers/imagem')


// Remover imagens de uma notícia, caso tenha havido um erro na sua publicação
router.get('/remover_imagens', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    req.body.urls.map(x => fs.unlink((__dirname + "public/" + x).replace("routes","").replace(/\\/g, "/"), err => {
        if (err) console.log(`Ocorreu um erro ao remover o ficheiro ${x.split("noticias/")[1]} da pasta de recursos públicos.`)
    }))

    Imagem.remover(req.body.urls)
        .then(dados => res.status(200).jsonp({}))
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao remover as imagens da notícia.`}))
})

// Upload de uma imagem durante a criação de uma notícia
router.post('/imagem', JWTUtils.validate, JWTUtils.isMedico, upload.single('imagem'), (req,res) => {
    let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
    let nova_diretoria = (__dirname + 'public/fileStore/noticias/' + Date.now() + "-" + req.file.originalname).replace("routes","").replace(/\\/g, "/");

    fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })

    let imagem = {
        nome_ficheiro: req.file.originalname,
        tamanho: req.file.size,
        tipo_mime: req.file.mimetype,
        url: nova_diretoria.split("public/")[1]
    }

    Imagem.inserir(imagem)
        .then(dados => res.status(200).jsonp({url: imagem.url}))
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao guardar a imagem ${imagem.nome_ficheiro}.`}))
})

module.exports = router;