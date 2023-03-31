var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Ciudades.controller");
const middleware = require("../utillities/jwtValidaciones");

router
  .route("/getCiudadesPorProvincia/:provincias_id")
  .get(middleware.checkToken, Ctrl.getCiudadesPorProvincia);
router
  .route("/getCiudadesIdPorNombre/:nombre")
  .get(middleware.checkToken, Ctrl.getCiudadesIdPorNombre);
router
  .route("/selectAllCiudades/")
  .get(middleware.checkToken, Ctrl.selectAllCiudades);
module.exports = router;
