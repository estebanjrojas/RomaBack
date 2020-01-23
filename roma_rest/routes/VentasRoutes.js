var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Ventas.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/getVentasTodas/').get(middleware.checkToken, Ctrl.getVentasTodas);
router.route('/getVentasBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getVentasBusqueda);
router.route('/getVentaPorId/:ventas_id').get(middleware.checkToken, Ctrl.getVentaPorId);
router.route('/insertVentaReturningFactura/').post(middleware.checkToken, Ctrl.insertVentaReturningFactura);
router.route('/anularVenta/').put(middleware.checkToken, Ctrl.anularVenta);
module.exports = router;

