var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Clientes.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/insertClientePersonaDomicilio/').post(middleware.checkToken, Ctrl.insertClientePersonaDomicilio);
router.route('/getClientesTodos/').get(middleware.checkToken, Ctrl.getClientesTodos);
router.route('/getClientesBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getClientesBusqueda);
router.route('/getDatosClientePorId/:id').get(middleware.checkToken, Ctrl.getDatosClientePorId);
router.route('/insertClientePersonaDomicilio/').post(middleware.checkToken, Ctrl.insertClientePersonaDomicilio);
router.route('/getClientesWhere/:campo_busqueda/:texto_buscar').get(middleware.checkToken, Ctrl.getClientesWhere);

module.exports = router;