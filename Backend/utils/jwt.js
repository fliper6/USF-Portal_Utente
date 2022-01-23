const cfg = require('../../config.json')

const SECRET = cfg.jwt.secret
const EXPIRES_IN = cfg.jwt.session

const jwt = require("jsonwebtoken");
const Blocklist = require('../controllers/blocklist')

module.exports.validate = (req, res, next) => {
    if(req.headers['authorization'] && req.headers['authorization'].match(/^Bearer\s+/)){
        let token = req.headers['authorization'].replace(/^Bearer\s+/, "");

        Blocklist.consultar(token)
            .then(dados => {
                if(dados) res.status(403).jsonp({erro: "Token expirado devido a logout."})
                else {
                    jwt.verify(token, SECRET, (err, user) => {
                        if (err) {
                            res.status(403).jsonp({erro: "Token expirado ou inválido."})
                            return;
                        }
                        req.user = user;
                        req.token = token;
                        next();
                        });
                    }
                })
            .catch(e => res.status(404).jsonp({erro: "Erro no acesso à base de dados."}))
    }
    else{
        res.status(403).jsonp({erro: "Não foi fornecido um token válido."})
    }
};

module.exports.compareNrUtente = (req,res,next) => {
    if(req.user.nr_utente === req.params.nr_utente) next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.compareId = (req,res,next) => {
    if(req.user._id === req.params._id) next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.isMedico = (req,res,next) => {
    if (req.user.nivel === "Secretário" || req.user.nivel === "Administrador") next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.isUtente = (req,res,next) => {
    if (req.user.nivel === "Utente" || req.user.nivel === "Secretário" || req.user.nivel === "Administrador") next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.isAdmin = (req,res,next) => {
    if (req.user.nivel === "Administrador") next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.calcularTamanho = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else {
      var kb = bytes/1024;
      if (kb < 1024) return `${(kb.toFixed(2))} KB`;
      else {
        var mb = kb/1024;
        if (mb < 1024) return `${(mb.toFixed(2))} MB`;
  
        return `${(mb/1024).toFixed(2)} GB`;
      }
    }
}

// criar array com os ids de todas as categorias existentes
module.exports.getIDsCategorias = arr => {
    let aux = arr => {
        arr.forEach(c => {
            ids.push(c.id)
            if (c.children.length > 0) aux(c.children)
        })
    }

    let ids = []
    aux(arr)
    return ids
}

module.exports.getCategoriaByID = (arr, id) => {
    let aux = arr => {
        arr.forEach(c => {
            if (c.id == id) label = c.label
            else if (c.children.length > 0) aux(c.children)
            return
        })
    }

    let label
    aux(arr)
    return label
}

module.exports.caminhoParaId = (arr, id) => {
    let aux = (arr, caminho) => {
        caminho.push("")
        let fim = false

        for (let i = 0; i < arr.length; i++) {
            caminho[caminho.length-1] = arr[i].id

            if (arr[i].id == id) {
                final = caminho
                fim = true
                break
            }
            else if (arr[i].children.length > 0) {
                let fim_children = aux(arr[i].children, JSON.parse(JSON.stringify(caminho)))
                if (fim_children) {
                    fim = true
                    break
                }
            }
        }

        return fim
    }

    let final = []
    aux(arr, [])
    return final
}

module.exports.criarIdCategoria = (nova_categoria, ids) => {
    let novo_id = nova_categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,"_")
    if (!ids.includes(novo_id)) return novo_id
    
    let i = 2
    while (ids.includes(novo_id + i)) {i++}
    return novo_id + i
}

function removerTodasCategorias(categorias) {
    let aux = arr => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].removed = true
            if (arr[i].children.length > 0) arr[i].children = aux(arr[i].children)
        }
        return arr
    }
    return aux(categorias)
}

module.exports.removerCategoria = (categorias, id) => {
    let aux = arr => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                arr[i].removed = true
                if (arr[i].children.length > 0) arr[i].children = removerTodasCategorias(arr[i].children)
                break
            }
            else if (arr[i].children.length > 0) arr[i].children = aux(arr[i].children)
        }
        return arr
    }

    return aux(categorias)
}

module.exports.categoriasNaoRemovidas = categorias => {
    let aux = arr => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].removed) arr.splice(i--, 1)
            else if (arr[i].children.length > 0) arr[i].children = aux(arr[i].children)
        }
        return arr
    }

    return aux(categorias)
}

module.exports.adicionarCategoria = (nova_cat, id_pai, arr) => {
    let aux = (nova_cat, id_pai, arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id_pai) {
                let nomesExistentes = arr[i].children.filter(x => !x.removed).map(x => x.label)
                let nomesRemovidos = arr[i].children.filter(x => x.removed).map(x => x.label)

                if (nomesExistentes.includes(nova_cat.label)) return "Já existe uma categoria com o mesmo nome neste local da árvore!"
                else if (nomesRemovidos.includes(nova_cat.label)) {
                    for (let j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].label == nova_cat.label) {
                            arr[i].children[j].removed = false
                            return arr
                        }
                    }
                }
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
                let atualizada = aux(nova_cat, id_pai, arr[i].children)
                if (typeof atualizada == "string") return atualizada
                else arr[i].children = atualizada
            }
        }
        return arr
    }

    return aux(nova_cat, id_pai, arr)
}

module.exports.restaurarCategorias = (caminho, categorias) => {
    let cats = categorias
    for (let i = 0; i < caminho.length; i++) {
        let ind = cats.findIndex(x => x.id == caminho[i])
        cats[ind].removed = false
        cats = cats[ind].children
    }
    return categorias
}

module.exports.SECRET = SECRET

module.exports.EXPIRES_IN = EXPIRES_IN