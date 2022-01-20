var express = require('express');
var router = express.Router();

const fs = require('fs');
const axios = require('axios');
var multer = require('multer');
var upload = multer({dest: './uploads'});
const FormData = require('form-data');
const JWTUtils = require('../utils/jwt');


function ficheiro(atual, ficheiros, paths, categorias, id_categoria, token, res) {
    let f = ficheiros[atual]
    
    let formData = new FormData();
    let titulo = f.originalname.slice(0, f.originalname.lastIndexOf("."))
    if (titulo.length > 65) titulo = titulo.slice(0, -(titulo.length - 65))

    formData.append('documento', fs.createReadStream(f.path))
    formData.append('titulo', titulo)
    formData.append('id_categoria', id_categoria)
    formData.append('originalname', f.originalname)

    axios.post("http://localhost:3333/documentos/", 
        formData, 
        { headers: {...formData.getHeaders(), 'Authorization': 'Bearer ' + token} })
        .then(() => {
            console.log("Documento importado:", f.originalname)
            return categoria(atual+1, ficheiros, paths, categorias, token, res)
        })
        .catch(e => console.log("Erro ao importar ficheiro:", f.originalname))
}

function categoria(atual, ficheiros, paths, categorias, token, res) {
    if (atual == ficheiros.length) res.status(201).jsonp(categorias)
    
    let cat_criada = false
    let cat = categorias.categorias[0]
    let id_pai = "categorias"

    let pastas = paths[atual].split('/').slice(1,-1)
    pastas.map((x,i) => {
        if (x.length > 35) pastas[i] = x.slice(0, -(x.length - 35))
        if (x.charAt(0) == x.charAt(0).toLowerCase()) pastas[i] = x.charAt(0).toUpperCase() + x.slice(1)
    })

    for (let i = 0; i < pastas.length; i++) {
        let indice = cat.children.findIndex(c => c.label == pastas[i])

        if (indice == -1) {
            axios.post("http://localhost:3333/documentos/criar_categoria", 
                {id_pai, nova_categoria: pastas[i]},
                {headers: { 'Authorization': 'Bearer ' + token }})
                .then(dados => {
                    console.log("Categoria criada:", pastas[i])
                    return categoria(atual, ficheiros, paths, dados.data, token, res)
                })
                .catch(e => console.log("Erro ao criar categoria:", pastas[i]))

            cat_criada = true
            break
        }
        else {
            cat = cat.children[indice]
            id_pai = cat.id
        }
    }

    if (!cat_criada) {
        if (!pastas.length) return categoria(atual+1, ficheiros, paths, categorias, token, res)
        return ficheiro(atual, ficheiros, paths, categorias, cat.id, token, res)
    }
}

// Importar a diretoria em questão para a aplicação
// Pastas -> Categorias; Ficheiros -> Documentos
router.post('/',  JWTUtils.validate, JWTUtils.isMedico, upload.any('diretoria'), (req,res) => {
    axios.get("http://localhost:3333/documentos/categorias")
        .then(dados => categoria(0, req.files, JSON.parse(req.body.paths), dados.data, req.token, res))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

module.exports = router;