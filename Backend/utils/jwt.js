const SECRET = 'LEI2021_SECRET_!_HASH'

const jwt = require("jsonwebtoken");

module.exports.validate = (req, res, next) => {
    let token = req.headers['authorization'].replace(/^Bearer\s+/, "");
    if(token){
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
        res.status(403).jsonp({erro: "Não foi fornecido um token."})
    }
};

module.exports.SECRET = SECRET