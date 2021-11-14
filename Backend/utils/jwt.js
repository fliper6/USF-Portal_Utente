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

module.exports.SECRET = SECRET