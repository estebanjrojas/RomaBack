var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Ventas.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/getVentasTodas/').get(middleware.checkToken, Ctrl.getVentasTodas);
router.route('/getVentasBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getVentasBusqueda);
router.route('/insertVentaReturningFactura/').post(middleware.checkToken, Ctrl.insertVentaReturningFactura);

module.exports = router;

