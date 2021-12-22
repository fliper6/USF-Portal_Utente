var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});

var fs = require('fs');
const JWTUtils = require('../utils/jwt');
const np = require("../utils/noticiasProgramadas");

let Noticia = require('../controllers/noticia');
let NoticiaProg = require("../controllers/noticiaProgramada");
let Ficheiro = require('../controllers/ficheiro');


// Obter lista de notícias
router.get('/', (req,res) => {
    Noticia.listar(req.query.visibilidade)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a listagem de notícias."}))
})

// Fazer download de um ficheiro de notícia
router.get('/download', (req,res) => {
    Noticia.consultar(req.query.id_noticia)
        .then(dados => {
            let ficheiro = dados.ficheiros.filter(x => x._id == req.query.id_ficheiro)[0]
            res.download((__dirname + "/" + ficheiro.diretoria).replace("routes","").replace(/\\/g, "/"))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a notícia."})) 
})

// Obter notícia por _id
router.get('/:id', (req,res) => {
    Noticia.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a notícia."}))
})

// Upload de uma notícia
router.post('/', JWTUtils.validate, JWTUtils.isMedico, upload.array('ficheiros'), (req,res) => {
    let ficheiros = [];
    let data_publicacao = new Date().toISOString();

    for (let i = 0; i < req.files.length; i++) {
        let diretoria = (__dirname + req.files[i].path).replace("routes","").replace(/\\/g, "/");
        let nova_diretoria = (__dirname + 'public/fileStore/noticias/' + Date.now() + "-" + req.files[i].originalname).replace("routes","").replace(/\\/g, "/");

        fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err });
        
        ficheiros.push({
            nome_ficheiro: req.files[i].originalname,
            tamanho: JWTUtils.calcularTamanho(req.files[i].size),
            tipo_mime: req.files[i].mimetype,
            diretoria: "public" + nova_diretoria.split("public")[1]
        });
    }

    let noticia = {
        titulo: req.body.titulo, 
        corpo: req.body.corpo,
        _id_autor: req.user._id,
        nome_autor: req.user.nome,
        data_criacao: data_publicacao,
        data_ultima_mod: data_publicacao,
        visibilidade: 0,
        ficheiros
    }

    let noticiaProg = {
      recorrencia: req.body.recorrencia.split(',').map(x => parseInt(x)),
      data_pub: req.body.data_pub,
      noticia,
    };

    // se for para publicar agora, insere a notícia na bd
    if (noticiaProg.data_pub === "now") {
      Noticia.inserir(noticia)
        .then((dados) => {
          // se for recorrente, insere notícia programada na bd e agenda-a
          if (noticiaProg.recorrencia.some((x) => x !== 0)) {
            noticiaProg.data_pub = data_publicacao
            noticiaProg.noticia.id_original = dados._id

            while (noticiaProg.data_pub <= data_publicacao) {
              noticiaProg.data_pub = np.proxData(noticiaProg.recorrencia, noticiaProg.data_pub);
            }

            NoticiaProg.inserir(noticiaProg)
              .then((notProg) => {
                noticiaProg._id = notProg._id;
                np.programarNoticia(noticiaProg);

                return res.status(200).jsonp(dados);
              })
              .catch((e) => res.status(500).jsonp({ error: "Ocorreu um erro ao dar upload à notícia." }));
          } else return res.status(200).jsonp(dados);
        })
        .catch((e) => res.status(500).jsonp({ error: "Ocorreu um erro ao dar upload à notícia." }));
    } else {
      NoticiaProg.inserir(noticiaProg)
        .then((notProg) => {
          noticiaProg._id = notProg._id;
          np.programarNoticia(noticiaProg);

          return res.status(200).jsonp(notProg);
        })
        .catch((e) => res.status(500).jsonp({ error: "Ocorreu um erro ao dar upload à notícia." }));
    }    
})

// Upload de um ficheiro durante a criação de uma notícia
router.post('/ficheiro', JWTUtils.validate, JWTUtils.isMedico, upload.single('ficheiro'), (req,res) => {
    let diretoria = (__dirname + req.file.path).replace("routes","").replace(/\\/g, "/");
    let nova_diretoria = (__dirname + 'public/fileStore/noticias/' + Date.now() + "-" + req.file.originalname).replace("routes","").replace(/\\/g, "/");

    fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err })

    let ficheiro = {
        nome_ficheiro: req.file.originalname,
        tamanho: req.file.size,
        tipo_mime: req.file.mimetype,
        url: nova_diretoria.split("public/")[1]
    }

    Ficheiro.inserir(ficheiro)
        .then(dados => res.status(200).jsonp({url: ficheiro.url}))
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao guardar o ficheiro ${ficheiro.nome_ficheiro}.`}))
})

// Editar uma notícia
router.put('/editar/:id', JWTUtils.validate, JWTUtils.isMedico, upload.array('ficheiros'), (req,res) => {
    let ficheiros_novos = [];
    let data_edicao = new Date().toISOString();

    for (let i = 0; i < req.files.length; i++) {
        let diretoria = (__dirname + req.files[i].path).replace("routes","").replace(/\\/g, "/");
        let nova_diretoria = (__dirname + 'public/fileStore/noticias/' + Date.now() + "-" + req.files[i].originalname).replace("routes","").replace(/\\/g, "/");

        fs.renameSync(diretoria, nova_diretoria, err => { if (err) throw err });
        
        ficheiros_novos.push({
            nome_ficheiro: req.files[i].originalname,
            tamanho: JWTUtils.calcularTamanho(req.files[i].size),
            tipo_mime: req.files[i].mimetype,
            diretoria: "public" + nova_diretoria.split("public")[1]
        });
    }

    Noticia.consultar(req.params.id)
        .then(dados => {
            req.body.ficheiros = JSON.parse(req.body.ficheiros)
            if (!Array.isArray(req.body.ficheiros)) req.body.ficheiros = [req.body.ficheiros]

            let nomes_ficheiros_body = req.body.ficheiros.map(x => x.nome_ficheiro)
            let eliminados = dados.ficheiros.filter(x => !nomes_ficheiros_body.includes(x.nome_ficheiro))
 
            eliminados.map(x => fs.unlink((__dirname + x.diretoria).replace("routes","").replace(/\\/g, "/"), err => {
                if (err) console.log(`Ocorreu um erro ao remover o ficheiro ${x.diretoria.split("noticias/")[1]} da pasta de recursos públicos.`)
            }))
            
            req.body.ficheiros = req.body.ficheiros.concat(ficheiros_novos)
            req.body.data_ultima_mod = data_edicao

            Noticia.atualizar(req.body)
                .then(dados => res.status(200).jsonp(dados))
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao atualizar a notícia."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a informação da notícia."}))
})

// Remover ficheiros de uma notícia, caso tenha havido um erro na sua publicação
router.put('/ficheiros', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    req.body.urls.map(x => fs.unlink((__dirname + "public/" + x).replace("routes","").replace(/\\/g, "/"), err => {
        if (err) console.log(`Ocorreu um erro ao remover o ficheiro ${x.split("noticias/")[1]} da pasta de recursos públicos.`)
    }))

    Ficheiro.remover(req.body.urls)
        .then(dados => res.status(200).jsonp({}))
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao remover os ficheiros da notícia.`}))
})

// Alterar a visibilidade de uma notícia
router.put('/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    let action
    if (req.query.visibilidade == 0) action = "tornar pública"
    if (req.query.visibilidade == 1) action = "remover"
    if (req.query.visibilidade == 2) action = "eliminar permanentemente"

    Noticia.alterarVisibilidade(req.params.id, req.query.visibilidade)
        .then(dados => {
            if (req.query.visibilidade != 1) return res.status(200).jsonp(dados)
            else {
                dados = JSON.parse(JSON.stringify(dados))
                let id_noticia = ("id_original" in dados ? dados.id_original : dados._id).toString()

                NoticiaProg.listarIDs()
                    .then(ids => {
                        ids = ids.map(x => x.noticia.id_original.toString())
                        res.status(200).jsonp({programada: ids.includes(id_noticia)})
                    })
                    .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao verificar se a notícia é programada.`}))
            }
        })
        .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao ${action} a notícia.`}))
})

module.exports = router;