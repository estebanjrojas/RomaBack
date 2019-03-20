var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
router.route('/getDatosUsuario/:usuario').get(middleware.checkToken, Ctrl.getDatosUsuario);
router.route('/getUsuariosTodos/').get(middleware.checkToken, Ctrl.getUsuariosTodos);
router.route('/getUsuariosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getUsuariosBusqueda);
router.route('/getDatosUsuariosCargados/:id').get(middleware.checkToken, Ctrl.getDatosUsuariosCargados);
router.route('/getPerfilesAsignados/:id').get(middleware.checkToken, Ctrl.getPerfilesAsignados);
router.route('/getPerfilesSinAsignar/:id').get(middleware.checkToken, Ctrl.getPerfilesSinAsignar);
router.route('/insertUsuarioReturnId/').post(middleware.checkToken, Ctrl.insertUsuarioReturnId);
router.route('/actualizarDatosUsuarios').put(Ctrl.actualizarDatosUsuarios);


module.exports = router;

