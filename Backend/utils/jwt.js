const SECRET = 'PI_2021_SECRET_!_HASH'

const jwt = require("jsonwebtoken");

module.exports.validate = (req, res, next) => {
    if(req.headers['authorization'] && req.headers['authorization'].match(/^Bearer\s+/)){
        let token = req.headers['authorization'].replace(/^Bearer\s+/, "");
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                res.status(403).jsonp({erro: "Token expirado ou inválido."})
                return;
            }
            req.user = user;
            next();
        });
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
    if (req.user.nivel === "medico" || req.user.nivel === "admin") next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.isUtente = (req,res,next) => {
    if (req.user.nivel === "utente" || req.user.nivel === "medico" || req.user.nivel === "admin") next()
    else res.status(403).jsonp({erro: "Não tem permissão para esta operação."})
}

module.exports.isAdmin = (req,res,next) => {
    if (req.user.nivel === "admin") next()
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
            if ("children" in c) aux(c.children)
        })
    }

    let ids = []
    aux(arr)
    return ids
}

module.exports.criarIdCategoria = (nova_categoria, ids) => {
    let novo_id = nova_categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,"_")
    if (!ids.includes(novo_id)) return novo_id
    
    let i = 2
    while (ids.includes(novo_id + i)) {i++}
    return novo_id + i
}

module.exports.SECRET = SECRET