var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Clientes.controller");

router.route('/insertClientePersonaDomicilio/').post(Ctrl.insertClientePersonaDomicilio);
router.route('/getClientesTodos/').get(Ctrl.getClientesTodos);
router.route('/getClientesBusqueda/:texto_busqueda').get(Ctrl.getClientesBusqueda);
router.route('/getDatosClientePorId/:id').get(Ctrl.getDatosClientePorId);
router.route('/insertClientePersonaDomicilio/').post(Ctrl.insertClientePersonaDomicilio);

module.exports = router;