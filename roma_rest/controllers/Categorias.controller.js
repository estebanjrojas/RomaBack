const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qCategorias = require("./query/Categorias.js");



/* ---------------------------GET---------------------------- */

exports.obtenerJSONTodasCategorias = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qCategorias.obtenerJSONTodasCategorias)
                    .then(resp => {
                        console.log(resp.rows[0]);
                        res.status(200).send(resp.rows[0]);
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                        res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                    });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }


};


exports.getCategoriasTodas = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qCategorias.getCategoriasTodas)
                    .then(resp => {
                        console.log(JSON.stringify(resp.rows));
                        res.status(200).send(JSON.stringify(resp.rows));
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                        res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                    });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }


};

exports.getCategoriasBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qCategorias.getCategoriasBusqueda, [req.params.texto_busqueda])
                    .then(resp => {
                        console.log(JSON.stringify(resp.rows));
                        res.status(200).send(JSON.stringify(resp.rows));
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                        res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                    });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }

};



//-----------> PAGINACION INICIO :
exports.getCantidadPaginasCategorias = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                query = ` 
                SELECT 
                    count(*) as cantidad_registros,
                    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
                FROM (
                    SELECT 
                        *, 
                        roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
                    FROM roma.categorias
                )x
                `;
                console.log(query);
                respuesta = await pool.query(query).then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send({ "regCantidadPaginas": resp.rows[0] });
                }).catch(err => {
                    console.error("ERROR", err.stack);
                    res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};

exports.getCantidadPaginasCategoriasTxt = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
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
        try {
            (async () => {
                query = ` 
                SELECT 
                    count(*) as cantidad_registros,
                    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
                FROM (
                    SELECT 
                        *, 
                        roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
                    FROM roma.categorias
                    `+ parametrosBusqueda + `
                )x `;
                console.log(query);
                respuesta = await pool.query(query).then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send({ "regCantidadPaginas": resp.rows[0] });
                }).catch(err => {
                    console.error("ERROR", err.stack);
                    res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};

exports.getCategorias = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                query = ` 
                SELECT 
                    *, 
                    roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
                FROM roma.categorias
                ORDER BY nombre
                OFFSET (5* ((CASE 
                    WHEN `+ req.params.paginaActual + `>` + req.params.cantidadPaginas + ` THEN ` + req.params.cantidadPaginas + ` 
                    WHEN `+ req.params.paginaActual + `<1 THEN 1 
                    ELSE `+ req.params.paginaActual + ` END) -1))
                LIMIT 5 `;
                console.log(query);
                respuesta = await pool.query(query).then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send(resp.rows);
                }).catch(err => {
                    console.error("ERROR", err.stack);
                    res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};

exports.getCategoriasTxt = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        let query = ``;
        var pool = new Pool({
            connectionString: connectionString,
        });
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
        try {
            (async () => {
                query = ` 
                SELECT 
                    *, 
                    roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
                FROM roma.categorias
                `+ parametrosBusqueda + `
                ORDER BY nombre
                OFFSET (5* ((CASE 
                    WHEN `+ req.params.paginaActual + `>` + req.params.cantidadPaginas + ` THEN ` + req.params.cantidadPaginas + ` 
                    WHEN `+ req.params.paginaActual + `<1 THEN 1 
                    ELSE `+ req.params.paginaActual + ` END)-1))
                LIMIT 5 `;
                console.log(query);
                respuesta = await pool.query(query).then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send(resp.rows);
                }).catch(err => {
                    console.error("ERROR", err.stack);
                    res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                });
                return respuesta;

            })()

        } catch (error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};
//<------------------PAGINACION FIN


/* ---------------------------POST---------------------------- */

exports.insert = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            let nombre = (req.body.nombre != undefined) ? req.body.nombre : `null`;
            let descripcion = (req.body.descripcion != undefined) ? req.body.descripcion : `null`;
            let categorias_id_padre = (req.body.categorias_padre_id != undefined) ? req.body.categorias_padre_id : `null`;

            await client.query('BEGIN')
            const { categoria } = await client.query(qCategorias.insert, [nombre, descripcion, categorias_id_padre])

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "La categoria se cargo exitosamente", "id": categoria });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la categoria", "error": e });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



/* ---------------------------PUT---------------------------- */



/* ---------------------------DELETE---------------------------- */