var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/PuntosVenta.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/getPuntosVentaTodos/').get(middleware.checkToken, Ctrl.getPuntosVentaTodos);
router.route('/getPuntosVentaBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getPuntosVentaBusqueda);
router.route('/insertPuntoVentaReturnId/').post(middleware.checkToken, Ctrl.insertPuntoVentaReturnId);
router.route('/insertCaracteristicasPuntoVenta/').post(middleware.checkToken, Ctrl.insertCaracteristicasPuntoVenta);
router.route('/actualizarDatosPuntoVenta').put(Ctrl.actualizarDatosPuntoVenta);
router.route('/eliminarCaracteristicasPuntoVenta/:punto_venta_id').delete(middleware.checkToken, Ctrl.eliminarCaracteristicasPuntoVenta);


module.exports = router;