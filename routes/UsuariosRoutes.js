var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");
const middleware = require("../utillities/jwtValidaciones");


//GET's
router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
router.route('/validarPassVieja/:nomb_usr/:pswrd').get(Ctrl.validarPassVieja);
router.route('/getDatosUsuario/:usuario').get(middleware.checkToken, Ctrl.getDatosUsuario);
router.route('/getUsuariosTodos/').get(middleware.checkToken, Ctrl.getUsuariosTodos);
router.route('/getUsuariosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getUsuariosBusqueda);
router.route('/getDatosUsuariosCargados/:id').get(middleware.checkToken, Ctrl.getDatosUsuariosCargados);
router.route('/getPerfilesAsignados/:id').get(middleware.checkToken, Ctrl.getPerfilesAsignados);
router.route('/getPerfilesSinAsignar/:id').get(middleware.checkToken, Ctrl.getPerfilesSinAsignar);
router.route('/getPerfilesCodificadosUsuario/:usuario').get(middleware.checkToken, Ctrl.getPerfilesCodificadosUsuario);
//------> Paginación Inicio
router.route('/getCantidadPaginasUsuarios/:busca_nombre/:busca_usuario/:busca_descripcion').get(middleware.checkToken, Ctrl.getCantidadPaginasUsuarios);
router.route('/getCantidadPaginasUsuarios/:busca_nombre/:busca_usuario/:busca_descripcion/:txt').get(middleware.checkToken, Ctrl.getCantidadPaginasUsuariosTxt);
router.route('/getUsuarios/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_usuario/:busca_descripcion').get(middleware.checkToken, Ctrl.getUsuarios);
router.route('/getUsuarios/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_usuario/:busca_descripcion/:txt').get(middleware.checkToken, Ctrl.getUsuariosTxt);
//------> Paginación Fin

//POST's

router.route('/insertUsuarioReturnId/').post(middleware.checkToken, Ctrl.insertUsuarioReturnId);
router.route('/insertPerfilesAsignados/').post(middleware.checkToken, Ctrl.insertPerfilesAsignados);

//PUT's
router.route('/actualizarDatosUsuarios').put(Ctrl.actualizarDatosUsuarios);
router.route('/cambiarPassword').put(Ctrl.cambiarPassword);


//DELETE's
router.route('/deletePerfiles/:id_usuario').delete(Ctrl.deletePerfiles);


module.exports = router;

