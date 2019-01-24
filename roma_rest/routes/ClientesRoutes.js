var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Clientes.controller");

router.route('/insertClientePersonaDomicilio/').post(Ctrl.insertClientePersonaDomicilio);
module.exports = router;