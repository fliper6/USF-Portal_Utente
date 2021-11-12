var express = require('express');
var router = express.Router();

let Contacto = require('../controllers/contacto')

/* GET home page. */
router.get('/', function(req, res, next) {
  Contacto.listar()
    .then(dados => res.status(200).jsonp(dados[0])) // [0] porque é so um objeto
    .catch(e => res.status(404).jsonp(e))
});

module.exports = router;