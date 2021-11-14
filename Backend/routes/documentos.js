var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');

let Documento = require('../controllers/documento')

router.get('/', (req,res) => {
    Documento.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/download', (req,res) => {
    res.download(req.body.diretoria);  
})

router.post('/', upload.array('documento'), (req,res) => {
    let documentos = []
    let data_publicacao = new Date().toISOString().substr(0,19);

    for (let i = 0; i < req.files.length; i++) {
        let diretoria = (__dirname + req.files[i].path).replace("routes","").replace(/\\/g, "/");
        let nova_diretoria = (__dirname + 'public/fileStore/documentos/' + Date.now() + "-" + req.files[i].originalname).replace("routes","").replace(/\\/g, "/");

        fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })
        let body = req.files.length == 1 ? req.body : req.body[i]

        documentos.push({
            titulo: req.files[i].originalname,
            tamanho: req.files[i].size,
            tipo_mime: req.files[i].mimetype,
            data_publicacao,
            diretoria: nova_diretoria,
            visibilidade: true,
            nr_utente_autor: body.nr_utente_autor,
            nome_autor: body.nome_autor
        });
    }
    
    Documento.inserir(documentos)
        .then(d => res.redirect('/documentos'))
        .catch(e => res.render('error', {error}))
})

router.put('/remover/:id', (req,res) => {
    Documento.remover(req.params.id)
        .then(d => res.redirect('/documentos'))
        .catch(e => res.render('error', {error}))
})

module.exports = router;