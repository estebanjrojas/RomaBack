var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/FacturaElectronica.controller");
const middleware = require("../utillities/jwtValidaciones");


router.route('/ultimoNumeroFacturaAprobada/:punto_venta/:tipo_comprobante').get(Ctrl.ultimoNumeroFacturaAprobada);
router.route('/generarFacturaElectronica/:ventas_id/:tipo_comprobante').get(Ctrl.generarFacturaElectronica);
router.route('/getEstadoServidor/').get(Ctrl.getEstadoServidor);
router.route('/getTributosDisponibles/').get(Ctrl.getTributosDisponibles);
router.route('/getOpcionesComprobanteDisponibles/').get(Ctrl.getOpcionesComprobanteDisponibles);
router.route('/getTiposMonedaDisponibles/').get(Ctrl.getTiposMonedaDisponibles);
router.route('/getTiposAlicuotasDisponibles/').get(Ctrl.getTiposAlicuotasDisponibles);
router.route('/getTiposDocumentosDisponibles/').get(Ctrl.getTiposDocumentosDisponibles);
router.route('/getTiposConceptoDisponibles/').get(Ctrl.getTiposConceptoDisponibles);
router.route('/getTiposComprobanteDisponibles/').get(Ctrl.getTiposComprobanteDisponibles);
router.route('/getDatosFacturaAfip/:numero/:punto_venta/:tipo_comprobante').get(Ctrl.getDatosFacturaAfip);
module.exports = router;