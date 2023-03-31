var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Sucursales.controller");
const middleware = require("../utillities/jwtValidaciones");

router
  .route("/sucursales/")
  .get(middleware.checkToken, Ctrl.sucursalesAbiertas);
module.exports = router;
