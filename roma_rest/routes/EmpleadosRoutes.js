var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Empleados.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/getEmpleadosTodos/').get(middleware.checkToken, Ctrl.getEmpleadosTodos);
router.route('/getEmpleadosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getEmpleadosBusqueda);
router.route('/getEmpleadoPorNroDoc/:nro_doc').get(middleware.checkToken, Ctrl.getEmpleadoPorNroDoc);
router.route('/getEmpleadosSinUsuario/').get(middleware.checkToken, Ctrl.getEmpleadosSinUsuario);
router.route('/insertEmpleadoReturnId/').post(middleware.checkToken, Ctrl.insertEmpleadoReturnId);
router.route('/insertEmpleadoPersonaDomicilio/').post(middleware.checkToken, Ctrl.insertEmpleadoPersonaDomicilio);
module.exports = router;