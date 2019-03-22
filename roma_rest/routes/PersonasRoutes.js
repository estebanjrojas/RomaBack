var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Personas.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/insertPersonaReturnId').post(middleware.checkToken, Ctrl.insertPersonaReturnId);
router.route('/insertPersonaDomicilio').post(middleware.checkToken, Ctrl.insertPersonaDomicilio);
router.route('/getPersonaPorNroDoc/:tipo_doc/:nro_doc').get(middleware.checkToken, Ctrl.getPersonaPorNroDoc);
module.exports = router;