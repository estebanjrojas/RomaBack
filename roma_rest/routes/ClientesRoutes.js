var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Clientes.controller");
const middleware = require("../utillities/jwtValidaciones");

//GET
router.route('/getClientesTodos/').get(middleware.checkToken, Ctrl.getClientesTodos);
router.route('/getClientesBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getClientesBusqueda);
router.route('/getDatosClientePorId/:id').get(middleware.checkToken, Ctrl.getDatosClientePorId);
router.route('/getClientesWhere/:campo_busqueda/:texto_buscar').get(middleware.checkToken, Ctrl.getClientesWhere);
router.route('/getCantidadPaginasClientes/:busca_nombre/:busca_apellido/:busca_dni/:busca_fecha_nac').get(middleware.checkToken, Ctrl.getCantidadPaginasClientes);
router.route('/getCantidadPaginasClientes/:busca_nombre/:busca_apellido/:busca_dni/:busca_fecha_nac/:txt').get(middleware.checkToken, Ctrl.getCantidadPaginasClientesTxt);
router.route('/getClientes/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_apellido/:busca_dni/:busca_fecha_nac').get(middleware.checkToken, Ctrl.getClientes);
router.route('/getClientes/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_apellido/:busca_dni/:busca_fecha_nac/:txt').get(middleware.checkToken, Ctrl.getClientesTxt);
//POST
router.route('/insertClientePersonaDomicilio/').post(middleware.checkToken, Ctrl.insertClientePersonaDomicilio);
router.route('/insertClientePersonaDomicilio/').post(middleware.checkToken, Ctrl.insertClientePersonaDomicilio);

//PUT

//DELETE


module.exports = router;