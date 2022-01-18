var express = require('express');
var router = express.Router();

const JWTUtils = require('../utils/jwt');
const np = require("../utils/noticiasProgramadas");

let Noticia = require('../controllers/noticia');
let NoticiaProg = require("../controllers/noticiaProgramada");

// Obter listas de notícias normais e programadas
router.get('/', (req,res) => {
    NoticiaProg.listar()
        .then(noticiasProg => {
            let ids_originais = noticiasProg.reduce((acc,cur) => {if ("id_original" in cur.noticia) acc.push(cur.noticia.id_original); return acc}, [])

            Noticia.listarOriginais(ids_originais)
                .then(noticiasNormais => res.status(200).jsonp({noticiasNormais, noticiasProg}))
                .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter as listas de notícias programadas e não programadas."}))
        })
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter as listas de notícias programadas e não programadas."}))
})

// Obter notícia programada por _id
router.get('/:id', (req,res) => {
    NoticiaProg.consultar(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: "Ocorreu um erro ao obter a notícia programada."}))
})

// Editar uma notícia programada
router.put('/editar/:id', JWTUtils.validate, JWTUtils.isMedico, (req,res) => {
    let noticiaProg = req.body
    noticiaProg.recorrencia = Array.isArray(noticiaProg.recorrencia) ? noticiaProg.recorrencia : noticiaProg.recorrencia.split(',').map(x => parseInt(x))

    if (noticiaProg.data_pub === "now") {
        let data_publicacao = new Date().toISOString();
        
        // atualizar as datas da nova iteração da notícia a publicar
        noticiaProg.noticia.data_criacao = data_publicacao
        noticiaProg.noticia.data_ultima_mod = data_publicacao

        Noticia.inserir(JSON.parse(JSON.stringify(noticiaProg.noticia)))
            .then(() => {
                // se for recorrente, atualiza a notícia programada na bd e reagenda-a
                if (noticiaProg.recorrencia.some(x => x !== 0)) {
                    noticiaProg.data_pub = data_publicacao;
        
                    while (noticiaProg.data_pub <= data_publicacao) {
                        noticiaProg.data_pub = np.proxData(noticiaProg.recorrencia, noticiaProg.data_pub);
                    }
        
                    np.atualizarNoticiaProg(noticiaProg, res)
                }
                // senão, remove a notícia programada da bd e cancela o job
                else if ("_id" in noticiaProg) {
                    NoticiaProg.remover(req.params.id)
                        .then(d => {
                            np.cancelarProgramacao(req.params.id)
                            res.status(200).jsonp({})
                        })
                        .catch(e => res.status(500).jsonp({error: `Erro ao terminar a programação da notícia '${req.params.id}'.`}))
                }
                else res.status(200).jsonp({})
            })
            .catch((e) =>  res.status(500).jsonp({ error: "Ocorreu um erro ao dar upload à notícia." }));
    } 
    else np.atualizarNoticiaProg(noticiaProg, res)
})

// Terminar a programação de uma notícia
router.delete('/:id', (req,res) => {
    NoticiaProg.remover(req.params.id)
        .then(dados => {
            np.cancelarProgramacao(req.params.id)
            res.status(200).jsonp(dados)
        })
        .catch(e => res.status(500).jsonp({error: `Erro ao terminar a programação da notícia '${req.params.id}'.`}))
})

module.exports = router;