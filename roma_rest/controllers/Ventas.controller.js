const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qVentas = require("./query/Ventas.js");




/* ---------------------------GET---------------------------- */

exports.getVentasTodas = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getVentasTodas)
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

exports.getVentasBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getVentasBusqueda, [req.params.texto_busqueda])
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

exports.getVentaPorId = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getVentaPorId, [req.params.ventas_id])
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

exports.getDetalleVentaPorVentasId = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getDetalleVentaPorVentasId, [req.params.ventas_id])
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



//-----------> PAGINACION INICIO :
exports.getCantidadPaginasVentas = function (req, res) {
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
                    SELECT v.id as ventas_id
                        , cli.id as clientes_id
                        , per.id as personas_id
                        , v.fecha
                        , per.nombre as nombre_cliente
                        , per.apellido as apellido_cliente
                        , per2.nombre as nombre_vendedor
                        , per2.apellido as apellido_vendedor
                        , v.monto_total as monto
                        , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
                        , v.fecha_anulacion
                        , v.usuario_anulacion
                    FROM roma.ventas v 
                    JOIN roma.clientes cli ON v.clientes_id = cli.id
                    JOIN personas per ON cli.personas_id = per.id
                    JOIN roma.empleados emp ON v.empleados_id = emp.id
                    JOIN personas per2 ON emp.personas_id = per2.id 
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

exports.getCantidadPaginasVentasTxt = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        let parametrosBusqueda = ``;
        let habilitarBusquedaFecha = parseInt(req.params.busca_fecha);
        let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
        let habilitarBusquedaVendedor = parseInt(req.params.busca_vendedor);
        let habilitarBusquedaMonto = parseInt(req.params.busca_monto);
        if ((habilitarBusquedaFecha + habilitarBusquedaNombre +
            habilitarBusquedaVendedor + habilitarBusquedaMonto) > 0) {
            parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
            if (habilitarBusquedaFecha == 1) {
                parametrosBusqueda = parametrosBusqueda + `v.fecha::varchar ilike '%` + req.params.txt + `%'`;
            }
            if (habilitarBusquedaNombre == 1) {
                if (habilitarBusquedaFecha == 0) {
                    parametrosBusqueda = parametrosBusqueda + `per.apellido::varchar ||', '|| per.nombre::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR per.apellido::varchar ||', '|| per.nombre::varchar ilike '%` + req.params.txt + `%'`;
                }
            }
            if (habilitarBusquedaVendedor == 1) {
                if ((habilitarBusquedaFecha + habilitarBusquedaNombre) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `per2.apellido::varchar ||', '|| per2.nombre::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR per2.apellido::varchar ||', '|| per2.nombre::varchar ilike '%` + req.params.txt + `%'`;
                }
            }
            if (habilitarBusquedaMonto == 1) {
                if ((habilitarBusquedaFecha + habilitarBusquedaNombre + habilitarBusquedaVendedor) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `v.monto_total::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR v.monto_total::varchar ilike '%` + req.params.txt + `%'`;
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
                    SELECT v.id as ventas_id
                        , cli.id as clientes_id
                        , per.id as personas_id
                        , v.fecha
                        , per.nombre as nombre_cliente
                        , per.apellido as apellido_cliente
                        , per2.nombre as nombre_vendedor
                        , per2.apellido as apellido_vendedor
                        , v.monto_total as monto
                        , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
                        , v.fecha_anulacion
                        , v.usuario_anulacion
                    FROM roma.ventas v 
                    JOIN roma.clientes cli ON v.clientes_id = cli.id
                    JOIN personas per ON cli.personas_id = per.id
                    JOIN roma.empleados emp ON v.empleados_id = emp.id
                    JOIN personas per2 ON emp.personas_id = per2.id 
                    `+ parametrosBusqueda + `
                    ORDER BY fecha desc, v.id
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

exports.getVentas = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                query = ` 
                SELECT v.id as ventas_id
                    , cli.id as clientes_id
                    , per.id as personas_id
                    , v.fecha
                    , per.nombre as nombre_cliente
                    , per.apellido as apellido_cliente
                    , per2.nombre as nombre_vendedor
                    , per2.apellido as apellido_vendedor
                    , v.monto_total as monto
                    , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
                    , v.fecha_anulacion
                    , v.usuario_anulacion
                FROM roma.ventas v 
                JOIN roma.clientes cli ON v.clientes_id = cli.id
                JOIN personas per ON cli.personas_id = per.id
                JOIN roma.empleados emp ON v.empleados_id = emp.id
                JOIN personas per2 ON emp.personas_id = per2.id 
                ORDER BY fecha desc, v.id
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

exports.getVentasTxt = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        let query = ``;
        var pool = new Pool({
            connectionString: connectionString,
        });
        let parametrosBusqueda = ``;
        let habilitarBusquedaFecha = parseInt(req.params.busca_fecha);
        let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
        let habilitarBusquedaVendedor = parseInt(req.params.busca_vendedor);
        let habilitarBusquedaMonto = parseInt(req.params.busca_monto);
        if ((habilitarBusquedaFecha + habilitarBusquedaNombre +
            habilitarBusquedaVendedor + habilitarBusquedaMonto) > 0) {
            parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
            if (habilitarBusquedaFecha == 1) {
                parametrosBusqueda = parametrosBusqueda + `v.fecha::varchar ilike '%` + req.params.txt + `%'`;
            }
            if (habilitarBusquedaNombre == 1) {
                if (habilitarBusquedaFecha == 0) {
                    parametrosBusqueda = parametrosBusqueda + `per.apellido::varchar ||', '|| per.nombre::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR per.apellido::varchar ||', '|| per.nombre::varchar ilike '%` + req.params.txt + `%'`;
                }
            }
            if (habilitarBusquedaVendedor == 1) {
                if ((habilitarBusquedaFecha + habilitarBusquedaNombre) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `per2.apellido::varchar ||', '|| per2.nombre::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR per2.apellido::varchar ||', '|| per2.nombre::varchar ilike '%` + req.params.txt + `%'`;
                }
            }
            if (habilitarBusquedaMonto == 1) {
                if ((habilitarBusquedaFecha + habilitarBusquedaNombre + habilitarBusquedaVendedor) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `v.monto_total::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR v.monto_total::varchar ilike '%` + req.params.txt + `%'`;
                }
            }
        }
        try {
            (async () => {
                query = ` 
                SELECT v.id as ventas_id
                    , cli.id as clientes_id
                    , per.id as personas_id
                    , v.fecha
                    , per.nombre as nombre_cliente
                    , per.apellido as apellido_cliente
                    , per2.nombre as nombre_vendedor
                    , per2.apellido as apellido_vendedor
                    , v.monto_total as monto
                    , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
                    , v.fecha_anulacion
                    , v.usuario_anulacion
                FROM roma.ventas v 
                JOIN roma.clientes cli ON v.clientes_id = cli.id
                JOIN personas per ON cli.personas_id = per.id
                JOIN roma.empleados emp ON v.empleados_id = emp.id
                JOIN personas per2 ON emp.personas_id = per2.id 
                `+ parametrosBusqueda + `
                ORDER BY fecha desc, v.id
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


exports.insertVentaReturningFactura = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            var ventas_id = -1;
            //Parametros para insertar la venta
            const clientes_id = req.body.cliente.clientes_id;
            const empleados_id = req.body.vendedor.empleados_id;
            const empresas_id = req.body.vendedor.empresas_id;
            const monto_total = req.body.monto_total;

            //Parametros para insertar los detalles de la venta
            const detalles = req.body.detalles;

            client.query('BEGIN', (err_transaccion, res_transaccion) => {
                if (err_transaccion) {
                    console.log('Ocurrio un error iniciando la transaccion: ' + err_transaccion.stack);
                }
                //Inicio la Venta
                client.query(qVentas.insertReturnId, [monto_total, empresas_id, empleados_id, clientes_id], (err_vta, res_vta) => {
                    if (err_vta) {
                        console.log('Ocurrio un error cargar la venta: ' + err_vta.stack);
                    }
                    ventas_id = res_vta.rows[0].id;
                    console.log({ "ventas": ventas_id });
                    for (let i = 0; i < detalles.length; i++) {
                        client.query(qVentas.insertDetalleReturnId, [detalles[i].cantidad, detalles[i].producto.precio_actual, detalles[i].descuento, detalles[i].subtotal, ventas_id, detalles[i].producto.productos_id], (err_dvta, res_dvta) => {
                            if (err_dvta) {
                                console.log('Ocurrio un error cargar el detalle de la venta: ' + err_dvta.stack);
                            }
                        });

                    }


                });

            });



            /*

            const { facturas_id } = await client.query(`
            SELECT roma.facturar_venta(${ventas_id}); `);*/

            await client.query('COMMIT;')
            res.status(200).send({ "mensaje": "La venta se cargo exitosamente", "insertado": ventas_id });
        } catch (e) {
            await client.query('ROLLBACK;')
            res.status(400).send({ "mensaje": `Ocurrio un error al cargar la venta: ${e}` });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};


/* ---------------------------PUT---------------------------- */


exports.anularVenta = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            let ventas_id = (req.body.ventas_id != undefined) ? req.body.ventas_id : `null`;
            let usuario = (req.body.usuario != undefined) ? req.body.usuario : `null`;

            await client.query('BEGIN');
            await client.query(qVentas.anularVenta, [usuario, ventas_id])
            await client.query('COMMIT');
            res.status(200).send({ "mensaje": "La venta se anulo exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al anular la venta" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};


/* ---------------------------DELETE---------------------------- */