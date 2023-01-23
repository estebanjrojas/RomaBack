var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Facturas.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/tipos_comprobantes').post(middleware.checkToken, Ctrl.getTiposComprobante);
module.exports = router;