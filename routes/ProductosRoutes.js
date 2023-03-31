var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Productos.controller");
const middleware = require("../utillities/jwtValidaciones");

//GET
router
  .route("/getProductosTodos/")
  .get(middleware.checkToken, Ctrl.getProductosTodos);
router
  .route("/getProductosBusqueda/:texto_busqueda")
  .get(middleware.checkToken, Ctrl.getProductosBusqueda);
router
  .route("/getDatosProductos/:id")
  .get(middleware.checkToken, Ctrl.getDatosProductos);
router
  .route("/getCaracteristicasProductos/:id")
  .get(middleware.checkToken, Ctrl.getCaracteristicasProductos);
router
  .route("/getCategoriasProductos/:id")
  .get(middleware.checkToken, Ctrl.getCategoriasProductos);
router
  .route("/getUltimoPrecioValido/:id")
  .get(middleware.checkToken, Ctrl.getUltimoPrecioValido);
router
  .route("/getHistorialPrecios/:id")
  .get(middleware.checkToken, Ctrl.getHistorialPrecios);
router
  .route("/getFotosCargadas/:id")
  .get(middleware.checkToken, Ctrl.getFotosCargadas);
router
  .route(
    "/getCantidadPaginasProductos/:busca_codigo/:busca_nombre/:busca_descripcion/:busca_categoria"
  )
  .get(middleware.checkToken, Ctrl.getCantidadPaginasProductos);
router
  .route(
    "/getCantidadPaginasProductos/:busca_codigo/:busca_nombre/:busca_descripcion/:busca_categoria/:txt"
  )
  .get(middleware.checkToken, Ctrl.getCantidadPaginasProductosTxt);
router
  .route(
    "/getProductos/:paginaActual/:cantidadPaginas/:busca_codigo/:busca_nombre/:busca_descripcion/:busca_categoria"
  )
  .get(middleware.checkToken, Ctrl.getProductos);
router
  .route(
    "/getProductos/:paginaActual/:cantidadPaginas/:busca_codigo/:busca_nombre/:busca_descripcion/:busca_categoria/:txt"
  )
  .get(middleware.checkToken, Ctrl.getProductosTxt);
router
  .route("/getImagenesProductos/:id")
  .get(middleware.checkToken, Ctrl.getImagenesProductos);
router
  .route(
    "/getProductosPorCategoriaCampoBusqueda/:categorias_id/:campo_buscar/:texto_buscar"
  )
  .get(middleware.checkToken, Ctrl.getProductosPorCategoriaCampoBusqueda);
router
  .route("/getNovedadesProductosLimit/:fecha_desde/:fecha_hasta/:limit")
  .get(middleware.checkToken, Ctrl.getNovedadesProductosLimit);
router
  .route("/verificarProductoPoseeCaracteristicas/:productos_id")
  .get(middleware.checkToken, Ctrl.verificarProductoPoseeCaracteristicas);
router
  .route("/verificarProductoPoseeImagenes/:productos_id")
  .get(middleware.checkToken, Ctrl.verificarProductoPoseeImagenes);
router
  .route("/productos/tipos/")
  .get(middleware.checkToken, Ctrl.getTiposProductos);

//POST
router
  .route("/insertProductoReturnId/")
  .post(middleware.checkToken, Ctrl.insertProductoReturnId);
router
  .route("/insertNuevoPrecioProducto/")
  .post(middleware.checkToken, Ctrl.insertNuevoPrecioProducto);
router
  .route("/insertCaracteristicasProducto/")
  .post(middleware.checkToken, Ctrl.insertCaracteristicasProducto);
router
  .route("/insertCategoriasProducto/")
  .post(middleware.checkToken, Ctrl.insertCategoriasProducto);
router
  .route("/cargarImagenProducto/")
  .post(middleware.checkToken, Ctrl.cargarImagenProducto);

//PUT
router.route("/actualizarDatosProductos").put(Ctrl.actualizarDatosProductos);
router
  .route("/actualizarFechaHastaPrecio")
  .put(Ctrl.actualizarFechaHastaPrecio);

//DELETE
router
  .route("/eliminarCaracteristicasProductos/:productos_id")
  .delete(middleware.checkToken, Ctrl.eliminarCaracteristicasProductos);
router
  .route("/eliminarImagenesProductos/:productos_id")
  .delete(middleware.checkToken, Ctrl.eliminarImagenesProductos);
router
  .route("/eliminarProductoById/:productos_id")
  .delete(middleware.checkToken, Ctrl.eliminarProductoById);
router
  .route("/insertEmpleadoPersonaDomicilio/")
  .post(middleware.checkToken, Ctrl.insertEmpleadoPersonaDomicilio);

module.exports = router;
