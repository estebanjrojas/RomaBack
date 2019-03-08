var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
router.route('/getDatosUsuario/:usuario').get(middleware.checkToken, Ctrl.getDatosUsuario);
router.route('/getUsuariosTodos/').get(middleware.checkToken, Ctrl.getUsuariosTodos);
router.route('/getUsuariosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getUsuariosBusqueda);

module.exports = router;

