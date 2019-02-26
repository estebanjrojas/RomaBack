var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Productos.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/getProductosTodos/').get(middleware.checkToken, Ctrl.getProductosTodos);
router.route('/getProductosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getProductosBusqueda);
router.route('/getDatosProductos/:id').get(middleware.checkToken, Ctrl.getDatosProductos);
router.route('/insertProductoReturnId/').post(middleware.checkToken, Ctrl.insertProductoReturnId);
router.route('/insertEmpleadoPersonaDomicilio/').post(middleware.checkToken, Ctrl.insertEmpleadoPersonaDomicilio);
module.exports = router;