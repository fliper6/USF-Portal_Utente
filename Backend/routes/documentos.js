var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt')

let Documento = require('../controllers/documento')
let Categoria = require('../controllers/categoria')

let categorias_base = [{id: "categorias", label: "Categorias", children: []}]

// Obter lista de documentos
router.get('/', (req,res) => {
    Documento.listar(req.query.visibilidade)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem de notícias."}))
})

// Obter árvore de categorias de documentos
router.get('/categorias', (req,res) => {
    Categoria.listar()
        .then(dados => res.status(200).jsonp(dados !== null ? dados : {categorias: categorias_base}))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

// Obter categoria de documentos por id
router.get('/categorias/:id', (req,res) => {
    Categoria.listar()
        .then(dados => {
            let categorias = dados !== null ? dados.categorias : categorias_base
            res.status(200).jsonp(JWTUtils.getCategoriaByID(categorias, req.params.id))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

// Fazer download de um documento
router.get('/download/:id', (req,res) => {
    Documento.consultar(req.params.id)
        .then(dados => res.download((__dirname + dados.ficheiro.diretoria).replace("routes","").replace(/\\/g, "/"), dados.ficheiro.nome_ficheiro))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter o documento."})) 
})

// Obter documento por _id
router.get('/:id', (req,res) => {
    Documento.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter o documento."}))
})

// Inserir uma nova categoria na árvore
router.post('/criar_categoria', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    Categoria.listar()
        .then(dados => {
            let categorias = dados !== null ? dados.categorias : categorias_base

            let ids = JWTUtils.getIDsCategorias(categorias)
            let novo_id = JWTUtils.criarIdCategoria(req.body.nova_categoria, ids)
            let nova_cat = {id: novo_id, label: req.body.nova_categoria, children: []}
            
            if (!ids.includes(req.body.id_pai)) return res.status(201).jsonp({erro: "O id do nodo pai enviado no pedido não existe!"})
            else {
                let atualizarArvore = (nova_cat, id_pai, arr) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id == id_pai) {
                            let nomes = arr[i].children.map(x => x.label)

                            if (nomes.includes(req.body.nova_categoria)) return "Já existe uma categoria com o mesmo nome neste local da árvore!"
                            else {
                                for (let j = 0; j < arr[i].children.length; j++) {
                                    if (arr[i].children[j].label > nova_cat.label) {
                                        arr[i].children.splice(j, 0, nova_cat); break
                                    }
                                    if (j == arr[i].children.length-1) {
                                        arr[i].children.push(nova_cat); break
                                    }
                                }

                                if (!arr[i].children.length) arr[i].children.push(nova_cat)
                                return arr
                            }
                        }
                        else if (arr[i].children.length > 0) {
                            let atualizada = atualizarArvore(nova_cat, id_pai, arr[i].children)
                            if (typeof atualizada == "string") return atualizada
                            else arr[i].children = atualizada
                        }
                    }
                    return arr
                }

                categorias = atualizarArvore(nova_cat, req.body.id_pai, categorias)
                if (typeof categorias == "string") return res.status(201).jsonp({erro: categorias})
            }

            Categoria.atualizar(categorias)
                .then(dados => res.status(200).jsonp(dados))
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao atualizar a árvore de categorias de documentos."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

// Dar upload a um novo documento
router.post('/', JWTUtils.validate, JWTUtils.isMedico, upload.single('documento'), (req,res) => {
    let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
    let nova_diretoria = (__dirname + 'public/fileStore/documentos/' + Date.now() + "-" + req.file.originalname).replace("routes","").replace(/\\/g, "/");
    fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })
    
    let documento = {
        titulo: req.body.titulo,
        data_publicacao: new Date().toISOString(),
        visibilidade: "0",
        _id_autor: req.user._id,
        nome_autor: req.user.nome,
        id_categoria: req.body.id_categoria,
        ficheiro: {
            nome_ficheiro: req.file.originalname,
            tamanho: JWTUtils.calcularTamanho(req.file.size),
            tipo_mime: req.file.mimetype,
            diretoria: "public" + nova_diretoria.split("public")[1]
        }
    }

    Categoria.listar()
        .then(dados => {
            let categorias = dados !== null ? dados.categorias : categorias_base
            documento.caminho_categorias = JWTUtils.caminhoParaId(categorias, req.body.id_categoria)

            Documento.inserir(documento)
                .then(d => res.status(200).jsonp(d))
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao dar upload ao documento."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))
})

// Tornar privado um documento
router.put('/remover/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    Documento.remover(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover o documento."}))
})

// Tornar publico um documento
router.put('/adicionar/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    Documento.consultar(req.params.id)
        .then(dados => {
            Categoria.listar()
                .then(dados => {
                    let categorias = dados !== null ? dados.categorias : categorias_base

                    Documento.adicionar(req.params.id)
                        .then(dados => res.status(200).jsonp(dados))
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover o documento."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem das categorias de documentos."}))

        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter o documento."}))
})

// Remover uma categoria da árvore
router.delete('/categoria/:id', (req,res) => {
    Categoria.listar()
        .then(dados => {
            let categorias = dados !== null ? dados.categorias : categorias_base

            Documento.listarEmCategoria(req.params.id)
                .then(docs => {
                    if (docs.length > 0) return res.status(200).jsonp({erro: "Não pode apagar esta categoria, porque existem documentos associados à mesma ou a alguma das suas subcategorias."})
                    
                    Categoria.atualizar(JWTUtils.removerCategoria(categorias, req.params.id))
                        .then(dados => res.status(200).jsonp(dados))
                        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover a categoria de documentos."}))
                })
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover a categoria de documentos."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao remover a categoria de documentos."}))
})

// Apagar permanentemente um documento
router.delete('/:id', JWTUtils.validate, JWTUtils.isMedico, function(req, res) {
    Documento.eliminar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(404).jsonp({error: e}))
});

module.exports = router;