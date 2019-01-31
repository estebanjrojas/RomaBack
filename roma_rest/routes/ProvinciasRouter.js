var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Provincias.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/getProvinciasPorPais/:paices_id').get(middleware.checkToken, Ctrl.getProvinciasPorPais);
module.exports = router;