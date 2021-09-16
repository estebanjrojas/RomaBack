const qCategorias = require("./query/Categorias.js");
const querySrv = require("../services/QueryService");

/* ---------------------------GET---------------------------- */

exports.obtenerJSONTodasCategorias = function (req, res) {
    querySrv.getQueryResults(qCategorias.obtenerJSONTodasCategorias, [])
    .then(response => res.send(response.value[0]))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCategoriasTodas = function (req, res) {
    querySrv.getQueryResults(qCategorias.getCategoriasTodas, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));  
}

exports.getCategoriasBusqueda = function (req, res) {
    querySrv.getQueryResults(qCategorias.getCategoriasBusqueda, [req.params.texto_busqueda])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

//-----------> PAGINACION INICIO :
exports.getCantidadPaginasCategorias = function (req, res) {
    querySrv.getQueryResults(qCategorias.getCantidadPaginasCategorias, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCantidadPaginasCategoriasTxt = function (req, res) {
    let parametrosBusqueda = ``;
    let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    let habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    let habilitarBusquedaCatPadre = parseInt(req.params.busca_catpadre);
    if ((habilitarBusquedaNombre + habilitarBusquedaDescripcion + habilitarBusquedaCatPadre) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
        if (habilitarBusquedaNombre == 1) {
            parametrosBusqueda = parametrosBusqueda + `nombre::varchar ilike '%` + req.params.txt + `%'`;
        }
        if (habilitarBusquedaDescripcion == 1) {
            if (habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `descripcion::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR descripcion::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
        if (habilitarBusquedaCatPadre == 1) {
            if ((habilitarBusquedaNombre + habilitarBusquedaDescripcion) == 0) {
                parametrosBusqueda = parametrosBusqueda + `roma.get_nombre_categoria_padre(categorias_id_padre)::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR roma.get_nombre_categoria_padre(categorias_id_padre)::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
    }
    const query = ` 
    SELECT 
        count(*) as cantidad_registros,
        (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
    FROM (
        SELECT 
            *, 
            roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
        FROM roma.categorias
        ${parametrosBusqueda}
    )x `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCategorias = function (req, res) {
    querySrv.getQueryResults(getCategorias, [req.params.paginaActual, req.params.cantidadPaginas])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCategoriasTxt = function (req, res) {
    let parametrosBusqueda = ``;
    const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    const habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    const habilitarBusquedaCatPadre = parseInt(req.params.busca_catpadre);
    if ((habilitarBusquedaNombre + habilitarBusquedaDescripcion + habilitarBusquedaCatPadre) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
        if (habilitarBusquedaNombre == 1) {
            parametrosBusqueda = parametrosBusqueda + `nombre::varchar ilike '%` + req.params.txt + `%'`;
        }
        if (habilitarBusquedaDescripcion == 1) {
            if (habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `descripcion::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR descripcion::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
        if (habilitarBusquedaCatPadre == 1) {
            if ((habilitarBusquedaNombre + habilitarBusquedaDescripcion) == 0) {
                parametrosBusqueda = parametrosBusqueda + `roma.get_nombre_categoria_padre(categorias_id_padre)::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR roma.get_nombre_categoria_padre(categorias_id_padre)::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
    }

    const query = ` 
    SELECT 
        *, 
        roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
    FROM roma.categorias
    ${parametrosBusqueda}
    ORDER BY nombre
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}
//<------------------PAGINACION FIN


/* ---------------------------POST---------------------------- */

exports.insert = function (req, res) {
    const nombre = (req.body.nombre != undefined) ? req.body.nombre : `null`;
    const descripcion = (req.body.descripcion != undefined) ? req.body.descripcion : `null`;
    const categorias_id_padre = (req.body.categorias_padre_id != undefined) ? req.body.categorias_padre_id : `null`;

    querySrv.getQueryResults(qCategorias.insert, [nombre, descripcion, categorias_id_padre])
    .then(response => res.send({ "mensaje": "La categoria se cargo exitosamente", "id": response.value[0] }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}
