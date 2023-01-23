var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Empleados.controller");
const middleware = require("../utillities/jwtValidaciones");



//GET
router.route('/getEmpleadosTodos/').get(middleware.checkToken, Ctrl.getEmpleadosTodos);
router.route('/getEmpleadosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getEmpleadosBusqueda);
router.route('/getEmpleadoPorNroDoc/:tipo_doc/:nro_doc').get(middleware.checkToken, Ctrl.getEmpleadoPorNroDoc);
router.route('/getEmpleadosSinUsuario/').get(middleware.checkToken, Ctrl.getEmpleadosSinUsuario);
router.route('/getDatosEmpleadoPorId/:id').get(middleware.checkToken, Ctrl.getDatosEmpleadoPorId);
//------> Paginación Inicio
router.route('/getCantidadPaginasEmpleados/:busca_nombre/:busca_documento/:busca_fechanac/:busca_oficina').get(middleware.checkToken, Ctrl.getCantidadPaginasEmpleados);
router.route('/getCantidadPaginasEmpleados/:busca_nombre/:busca_documento/:busca_fechanac/:busca_oficina/:txt').get(middleware.checkToken, Ctrl.getCantidadPaginasEmpleadosTxt);
router.route('/getEmpleados/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_documento/:busca_fechanac/:busca_oficina').get(middleware.checkToken, Ctrl.getEmpleados);
router.route('/getEmpleados/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_documento/:busca_fechanac/:busca_oficina/:txt').get(middleware.checkToken, Ctrl.getEmpleadosTxt);
//------> Paginación Fin

//POST
router.route('/insertEmpleadoReturnId/').post(middleware.checkToken, Ctrl.insertEmpleadoReturnId);
router.route('/guardarEmpleadoPersonaDomicilio/').post(middleware.checkToken, Ctrl.guardarEmpleadoPersonaDomicilio);

//PUT


//DELETE




module.exports = router;