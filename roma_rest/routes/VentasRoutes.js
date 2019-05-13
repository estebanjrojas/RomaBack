var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Ventas.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/insertVentaReturningFactura/').post(middleware.checkToken, Ctrl.insertVentaReturningFactura);

module.exports = router;

