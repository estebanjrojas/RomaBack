var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Public.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/selectAllCiudades/').get(middleware.checkToken, Ctrl.selectAllCiudades);
module.exports = router;