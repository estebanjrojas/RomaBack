var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/MenuController");
const middleware = require("../utillities/jwtValidaciones");

router.route("/getMenuUsuario/:nomb_usr").get(Ctrl.getMenuUsuario);
router
  .route("/getPerfilesCodificadosMenu/:ruta_menu")
  .get(middleware.checkToken, Ctrl.getPerfilesCodificadosMenu);

module.exports = router;
