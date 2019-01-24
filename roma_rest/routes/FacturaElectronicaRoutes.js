var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/FacturaElectronica.controller");


router.route('/soap').post(Ctrl.soap);
module.exports = router;