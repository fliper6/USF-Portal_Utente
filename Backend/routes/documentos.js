var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt')

let Documento = require('../controllers/documento')
let Categoria = require('../controllers/categoria')

// Obter lista de documentos
router.get('/', (req,res) => {
    Documento.listar()
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem de documentos."}))
})

// Obter árvore de categorias de documentos
router.get('/categorias', (req,res) => {
    Categoria.listar()
        .then(dados => res.status(200).jsonp(dados !== null ? dados : {categorias: []}))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
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
            categoria: body.categoria, //para usar o Postman: JSON.parse(body.categoria),
            ficheiro: {
                nome_ficheiro: req.files[i].originalname,
                tamanho: JWTUtils.calcularTamanho(req.files[i].size),
                tipo_mime: req.files[i].mimetype,
                diretoria: "public" + nova_diretoria.split("public")[1]
            }
        });
    }

    Categoria.listar()
        .then(dados => {
            let novaCategoria = (categorias, novaArr, id, i) => {
                let indice = !categorias.length ? -1 : categorias.findIndex(x => x.label == novaArr[i])
                if (indice == -1) {
                    let len = categorias.length
                    let novaLetraID = !len ? "a" : String.fromCharCode(categorias[len-1].id.slice(-1).charCodeAt(0) + 1)

                    categorias.push({id: id + novaLetraID, label: novaArr[i]})
                    indice = categorias.length-1
                }
                
                if (i < novaArr.length-1) {
                    if (!("children" in categorias[indice])) categorias[indice].children = []
                    categorias[indice].children = novaCategoria(categorias[indice].children, novaArr, categorias[indice].id, ++i)
                }
                return categorias
            }
            
            // caso ainda não haja categorias
            if (dados === null) dados = {categorias: []}

            for (let i = 0; i < documentos.length; i++) {
                dados.categorias = novaCategoria(dados.categorias, documentos[i].categoria, "", 0)
            }

            Categoria.atualizar(dados.categorias)
                .then(d => {
                    Documento.inserir(documentos)
                        .then(dados => res.status(200).jsonp(dados))
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao dar upload aos documentos."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao dar upload aos documentos."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao ir buscar a árvore de categorias de documentos."}))
})

// Tornar privado um documento
router.put('/remover/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    Documento.remover(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover o documento."}))
})

module.exports = router;