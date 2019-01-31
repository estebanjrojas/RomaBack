var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
router.route('/getDatosUsuario/:usuario').get(middleware.checkToken, Ctrl.getDatosUsuario);
module.exports = router;

