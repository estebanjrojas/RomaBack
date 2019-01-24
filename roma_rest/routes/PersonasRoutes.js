var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Personas.controller");

router.route('/insertPersonaReturnId').post(Ctrl.insertPersonaReturnId);
router.route('/insertPersonaDomicilio').post(Ctrl.insertPersonaDomicilio);
router.route('/getPersonaPorNroDoc/:nro_doc').get(Ctrl.getPersonaPorNroDoc);
module.exports = router;