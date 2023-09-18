var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Predicciones.controller");
const middleware = require("../utillities/jwtValidaciones");



router.route('/getCSVParseado').post(Ctrl.getCSVParseado);



module.exports = router;