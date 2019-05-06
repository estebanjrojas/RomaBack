var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Productos.controller");
const middleware = require("../utillities/jwtValidaciones");

//GET
router.route('/getProductosTodos/').get(middleware.checkToken, Ctrl.getProductosTodos);
router.route('/getProductosBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getProductosBusqueda);
router.route('/getDatosProductos/:id').get(middleware.checkToken, Ctrl.getDatosProductos);
router.route('/getCaracteristicasProductos/:id').get(middleware.checkToken, Ctrl.getCaracteristicasProductos);
router.route('/getCategoriasProductos/:id').get(middleware.checkToken, Ctrl.getCategoriasProductos);
router.route('/getUltimoPrecioValido/:id').get(middleware.checkToken, Ctrl.getUltimoPrecioValido);
router.route('/getHistorialPrecios/:id').get(middleware.checkToken, Ctrl.getHistorialPrecios);

//POST
router.route('/insertProductoReturnId/').post(middleware.checkToken, Ctrl.insertProductoReturnId);
router.route('/insertNuevoPrecioProducto/').post(middleware.checkToken, Ctrl.insertNuevoPrecioProducto);
router.route('/insertCaracteristicasProducto/').post(middleware.checkToken, Ctrl.insertCaracteristicasProducto);
router.route('/insertCategoriasProducto/').post(middleware.checkToken, Ctrl.insertCategoriasProducto);

//PUT
router.route('/actualizarDatosProductos').put(Ctrl.actualizarDatosProductos);
router.route('/actualizarFechaHastaPrecio').put(Ctrl.actualizarFechaHastaPrecio);

//DELETE
router.route('/eliminarCaracteristicasProductos/:productos_id').delete(middleware.checkToken, Ctrl.eliminarCaracteristicasProductos);
router.route('/insertEmpleadoPersonaDomicilio/').post(middleware.checkToken, Ctrl.insertEmpleadoPersonaDomicilio);
router.route('/getImagenesProductos/:id').get(middleware.checkToken, Ctrl.getImagenesProductos);
router.route('/getProductosPorCategoriaCampoBusqueda/:categorias_id/:campo_buscar/:texto_buscar').get(middleware.checkToken, Ctrl.getProductosPorCategoriaCampoBusqueda);
module.exports = router;