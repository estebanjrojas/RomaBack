var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Ventas.controller");
const middleware = require("../utillities/jwtValidaciones");

//GET
router.route('/getVentasTodas/').get(middleware.checkToken, Ctrl.getVentasTodas);
router.route('/getVentasBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getVentasBusqueda);
router.route('/getVentaPorId/:ventas_id').get(middleware.checkToken, Ctrl.getVentaPorId);
router.route('/getDetalleVentaPorVentasId/:ventas_id').get(middleware.checkToken, Ctrl.getDetalleVentaPorVentasId);
//------> Paginación Inicio
router.route('/getCantidadPaginasVentas/:busca_fecha/:busca_nombre/:busca_vendedor/:busca_monto').get(middleware.checkToken, Ctrl.getCantidadPaginasVentas);
router.route('/getCantidadPaginasVentas/:busca_fecha/:busca_nombre/:busca_vendedor/:busca_monto/:txt').get(middleware.checkToken, Ctrl.getCantidadPaginasVentasTxt);
router.route('/getVentas/:paginaActual/:cantidadPaginas/:busca_fecha/:busca_nombre/:busca_vendedor/:busca_monto').get(middleware.checkToken, Ctrl.getVentas);
router.route('/getVentas/:paginaActual/:cantidadPaginas/:busca_fecha/:busca_nombre/:busca_vendedor/:busca_monto/:txt').get(middleware.checkToken, Ctrl.getVentasTxt);
//------> Paginación Fin
router.route('/getVentasDiariasEmpleados/:fecha').get(middleware.checkToken, Ctrl.getVentasDiariasEmpleados);
router.route('/ultimasVentas/').get(middleware.checkToken, Ctrl.getUltimasVentas);
router.route('/ultimasVentasEmpleado/:empleados_id').get(middleware.checkToken, Ctrl.getUltimasVentasEmpleado);
router.route('/estadisticasVentasDiarias/:fecha_desde/:fecha_hasta').get(middleware.checkToken, Ctrl.estadisticasVentasDiarias);
router.route('/estadisticasVentasDiariasEmpleado/:fecha_desde/:fecha_hasta/:empleados_id').get(middleware.checkToken, Ctrl.estadisticasVentasDiariasEmpleado);
router.route('/estadisticasVentasMensuales/:fecha_desde/:fecha_hasta').get(middleware.checkToken, Ctrl.estadisticasVentasMensuales);

//POST
router.route('/insertVentaReturningFactura/').post(middleware.checkToken, Ctrl.insertVentaReturningFactura);


//PUT
router.route('/anularVenta/').put(middleware.checkToken, Ctrl.anularVenta);


//DELETE



module.exports = router;

