var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
router.route('/validarPassVieja/:nomb_usr/:pswrd').get(Ctrl.validarPassVieja);
router.route('/cambiarPassword').put(Ctrl.cambiarPassword);
router.route('/getDatosUsuario/:usuario').get(middleware.checkToken, Ctrl.getDatosUsuario);
router.route('/getUsuariosTodos/').get(middleware.checkToken, Ctrl.getUsuariosTodos);
router.route('/getUsuariosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getUsuariosBusqueda);
router.route('/getDatosUsuariosCargados/:id').get(middleware.checkToken, Ctrl.getDatosUsuariosCargados);
router.route('/getPerfilesAsignados/:id').get(middleware.checkToken, Ctrl.getPerfilesAsignados);
router.route('/getPerfilesSinAsignar/:id').get(middleware.checkToken, Ctrl.getPerfilesSinAsignar);
router.route('/insertUsuarioReturnId/').post(middleware.checkToken, Ctrl.insertUsuarioReturnId);
router.route('/insertPerfilesAsignados/').post(middleware.checkToken, Ctrl.insertPerfilesAsignados);
router.route('/actualizarDatosUsuarios').put(Ctrl.actualizarDatosUsuarios);
router.route('/deletePerfiles/:id_usuario').delete(Ctrl.deletePerfiles);


module.exports = router;

