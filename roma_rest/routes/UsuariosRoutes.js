var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Usuarios.controller");

router.route('/solicitarAccesoUsuario/:nomb_usr/:pswrd').get(Ctrl.solicitarAccesoUsuario);
module.exports = router;

