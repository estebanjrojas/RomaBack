var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Categorias.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/obtenerJSONTodasCategorias/').get(middleware.checkToken, Ctrl.obtenerJSONTodasCategorias);
router.route('/getCategoriasTodas/').get(middleware.checkToken, Ctrl.getCategoriasTodas);
router.route('/getCategoriasBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getCategoriasBusqueda);
module.exports = router;