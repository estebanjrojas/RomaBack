var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/FacturasImpresion.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/sendPDF').get(Ctrl.sendPDF);

module.exports = router;