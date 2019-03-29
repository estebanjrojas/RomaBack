var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/PuntosVenta.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/getPuntosVentaTodos/').get(middleware.checkToken, Ctrl.getPuntosVentaTodos);
router.route('/getPuntosVentaBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getPuntosVentaBusqueda);


module.exports = router;