var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Public.controller");

router.route('/selectAllCiudades/').get(Ctrl.selectAllCiudades);
module.exports = router;