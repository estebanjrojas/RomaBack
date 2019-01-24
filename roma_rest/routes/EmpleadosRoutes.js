var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Empleados.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/getEmpleadoPorNroDoc/:nro_doc').get(middleware.checkToken, Ctrl.getEmpleadoPorNroDoc);
router.route('/insertEmpleadoReturnId/').post(middleware.checkToken, Ctrl.insertEmpleadoReturnId);
router.route('/insertEmpleadoPersonaDomicilio/').post(middleware.checkToken, Ctrl.insertEmpleadoPersonaDomicilio);
module.exports = router;