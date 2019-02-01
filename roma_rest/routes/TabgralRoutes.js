var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Tabgral.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/selectTabgralByNroTab/:nro_tab').get(middleware.checkToken, Ctrl.selectTabgralByNroTab);
module.exports = router;