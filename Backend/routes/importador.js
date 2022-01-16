var express = require('express');
var router = express.Router();

const fs = require('fs');
const axios = require('axios');
const dirTree = require("directory-tree");
const FormData = require('form-data');
const JWTUtils = require('../utils/jwt');


function importarPai(tree, indices, ids, ids_pai, categorias, token, res) {
    if (ids_pai[ids_pai.length-1] == "categorias") res.status(201).jsonp(categorias)
    else {
        ids_pai.pop()
        indices.pop()
        indices[indices.length-1]++
        return importarDir(tree, indices, ids, ids_pai, categorias, token, res)
    }
}

function proxIteracao(pai, tree, indices, ids, ids_pai, categorias, token, res) {
    if (indices[indices.length-1]+1 == pai.children.length) {
        return importarPai(tree, indices, ids, ids_pai, categorias, token, res)
    }
    else {
        indices[indices.length-1]++
        return importarDir(tree, indices, ids, ids_pai, categorias, token, res)
    }
}

function importarDir(tree, indices, ids, ids_pai, categorias, token, res) {
    let elem = tree, pai = null
    for (let i = 0; i < indices.length; i++) {
        if (elem.children.length > indices[i]) {
            pai = elem
            elem = elem.children[indices[i]]
        }
        else return importarPai(tree, indices, ids, ids_pai, categorias, token, res)
    }

    if (elem.type == "directory") {
        let novo_id = JWTUtils.criarIdCategoria(elem.name, ids)
        
        axios.post("http://localhost:3333/documentos/criar_categoria", 
            {id_pai: ids_pai[ids_pai.length-1], nova_categoria: elem.name},
            {headers: { 'Authorization': 'Bearer ' + token }})
            .then(dados => {
                console.log(`Categoria ${"erro" in dados.data ? "já existe" : "criada"}:`, elem.name)

                if (!("erro" in dados.data)) {
                    categorias = dados.data
                    ids.push(novo_id)
                }
                else {
                    let cats = JSON.parse(JSON.stringify(categorias.categorias))
                    for (let i = 0; i < ids_pai.length; i++) cats = cats[cats.findIndex(x => x.id == ids_pai[i])].children
                    novo_id = cats[cats.findIndex(x => x.label == elem.name)].id
                }

                if (elem.children.length > 0) {
                    indices.push(0)
                    ids_pai.push(novo_id)
                    return importarDir(tree, indices, ids, ids_pai, categorias, token, res)
                }
                return proxIteracao(pai, tree, indices, ids, ids_pai, categorias, token, res)
            })
            .catch(e => console.log("Erro ao criar categoria:", elem.name))
    }
    else {
        let formData = new FormData();
        formData.append('documento', fs.createReadStream(elem.path))
        formData.append('titulo', elem.name.slice(0, -(elem.extension.length)))
        formData.append('id_categoria', ids_pai[ids_pai.length-1])

        axios.post("http://localhost:3333/documentos/", 
            formData, 
            { headers: {...formData.getHeaders(), 'Authorization': 'Bearer ' + token} })
            .then(() => {
                console.log("Documento importado:", elem.name)
                return proxIteracao(pai, tree, indices, ids, ids_pai, categorias, token, res)
            })
            .catch(e => console.log("Erro ao importar ficheiro:", elem.name))
    }
}

// Obter árvore de categorias de documentos
router.post('/',  JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    axios.get("http://localhost:3333/documentos/categorias")
        .then(dados => {
            let categorias = dados.data.categorias
            let ids = JWTUtils.getIDsCategorias(categorias)
            let tree = dirTree(req.body.diretoria, {attributes:['type','extension']});

            if (tree.type != "directory") return res.status(500).jsonp({error: "A diretoria indicada não é uma pasta!"})
            else if (!tree.children.length) return res.status.apply(500).jsonp({error: "A diretoria que pretende importar está vazia!"})
            else importarDir(tree, [0], ids, ["categorias"], dados.data, req.token, res)
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

module.exports = router;