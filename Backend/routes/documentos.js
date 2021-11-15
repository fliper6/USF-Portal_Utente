var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt')

let Documento = require('../controllers/documento')
let TipoDocumento = require('../controllers/tipo_documento')

// Obter lista de documentos
router.get('/', (req,res) => {
    Documento.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem de documentos."}))
})

// Obter árvore de tipos de documentos
router.get('/tipos', (req,res) => {
    TipoDocumento.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem dos tipos de documentos."}))
})

// Fazer download de um documento
router.get('/download', (req,res) => {
    res.download((__dirname + req.body.diretoria).replace(/\\/g, "/"));  
})

// Dar upload a documentos
router.post('/', JWTUtils.validate, JWTUtils.isMedico, upload.array('documento'), (req,res) => {
    let documentos = [];
    let data_publicacao = new Date().toISOString().substr(0,19);

    for (let i = 0; i < req.files.length; i++) {
        let diretoria = (__dirname + req.files[i].path).replace("routes","").replace(/\\/g, "/");
        let nova_diretoria = (__dirname + 'public/fileStore/documentos/' + Date.now() + "-" + req.files[i].originalname).replace("routes","").replace(/\\/g, "/");

        fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })
        let body = req.files.length == 1 ? req.body : req.body[i]
        
        documentos.push({
            titulo: body.titulo,
            data_publicacao,
            visibilidade: true,
            nr_utente_autor: body.nr_utente_autor,
            nome_autor: body.nome_autor,
            tipo: body.tipo,
            ficheiro: {
                nome_ficheiro: req.files[i].originalname,
                tamanho: req.files[i].size,
                tipo_mime: req.files[i].mimetype,
                diretoria: "public" + nova_diretoria.split("public")[1]
            }
        });
    }

    TipoDocumento.listar()
        .then(dados => {
            let novoTipo = (tipos, novoTipoArr, id, i) => {
                let indice = !tipos.length ? -1 : tipos.findIndex(x => x.label == novoTipoArr[i])
                if (indice == -1) {
                    let len = tipos.length
                    let novaLetraID = !len ? "a" : String.fromCharCode(tipos[len-1].id.slice(-1).charCodeAt(0) + 1)

                    tipos.push({id: id + novaLetraID, label: novoTipoArr[i]})
                    indice = tipos.length-1
                }
                
                if (i < novoTipoArr.length-1) {
                    if (!("children" in tipos[indice])) tipos[indice].children = []
                    tipos[indice].children = novoTipo(tipos[indice].children, novoTipoArr, tipos[indice].id, ++i)
                }
                return tipos
            }

            for (let i = 0; i < documentos.length; i++) {
                dados.tipos = novoTipo(dados.tipos, documentos[i].tipo, "", 0)
            }

            TipoDocumento.atualizar(dados.tipos)
                .then(d => {
                    Documento.inserir(documentos)
                        .then(dados => res.status(200).jsonp(dados))
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao dar upload aos documentos."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao dar upload aos documentos."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao ir buscar a árvore de tipos de documentos."}))
})

// Tornar privado um documento
router.put('/remover/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    Documento.remover(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover o documento."}))
})

module.exports = router;