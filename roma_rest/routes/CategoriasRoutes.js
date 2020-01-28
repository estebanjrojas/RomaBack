var express = require("express");
var router = express.Router();
var Ctrl = require("../controllers/Categorias.controller");
const middleware = require("../utillities/jwtValidaciones");


//GET
router.route('/obtenerJSONTodasCategorias/').get(middleware.checkToken, Ctrl.obtenerJSONTodasCategorias);
router.route('/getCategoriasTodas/').get(middleware.checkToken, Ctrl.getCategoriasTodas);
router.route('/getCategoriasBusqueda/:texto_busqueda').get(middleware.checkToken, Ctrl.getCategoriasBusqueda);
//------> Paginación Inicio
router.route('/getCantidadPaginasCategorias/:busca_nombre/:busca_descripcion/:busca_catpadre').get(middleware.checkToken, Ctrl.getCantidadPaginasCategorias);
router.route('/getCantidadPaginasCategorias/:busca_nombre/:busca_descripcion/:busca_catpadre/:txt').get(middleware.checkToken, Ctrl.getCantidadPaginasCategoriasTxt);
router.route('/getCategorias/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_descripcion/:busca_catpadre').get(middleware.checkToken, Ctrl.getCategorias);
router.route('/getCategorias/:paginaActual/:cantidadPaginas/:busca_nombre/:busca_descripcion/:busca_catpadre/:txt').get(middleware.checkToken, Ctrl.getCategoriasTxt);
//------> Paginación Fin

//POST
router.route('/categorias/insert/').post(middleware.checkToken, Ctrl.insert);


//PUT


//DELETE
module.exports = router;