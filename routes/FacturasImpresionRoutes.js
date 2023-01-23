var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/FacturasImpresion.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/generarFacturaPDF/:facturas_id').get(Ctrl.generarFacturaPDF);

module.exports = router;