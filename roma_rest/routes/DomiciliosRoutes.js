var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Domicilios.controller");
const middleware = require("../utillities/jwtValidaciones");

router.route('/getDomicilioByNroDoc/:nro_doc').get(middleware.checkToken, Ctrl.getDomicilioByNroDoc);
router.route('/getCalles/:calles_nombre').get(middleware.checkToken, Ctrl.getCalles);
router.route('/getCallesEmpty/').get(middleware.checkToken, Ctrl.getCallesEmpty);
router.route('/insert/').post(middleware.checkToken, Ctrl.insert);
module.exports = router;

