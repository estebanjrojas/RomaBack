var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Categorias.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/obtenerJSONTodasCategorias/').get(middleware.checkToken, Ctrl.obtenerJSONTodasCategorias);
module.exports = router;