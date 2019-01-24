var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Tabgral.controller");

router.route('/selectTabgralByNroTab/:nro_tab').get(Ctrl.selectTabgralByNroTab);
module.exports = router;