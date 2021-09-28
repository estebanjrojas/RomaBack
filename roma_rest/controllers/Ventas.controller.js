const qVentas = require("./query/Ventas.js");
const poolSrv = require("../services/PoolService");
const querySrv = require("../services/QueryService");
/* ---------------------------GET---------------------------- */

exports.getVentasTodas = function (req, res) {
    querySrv.getQueryResults(qVentas.getVentasTodas, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getVentasBusqueda = function (req, res) {
    querySrv.getQueryResults(qVentas.getVentasBusqueda, [req.params.texto_busqueda])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getVentaPorId = function (req, res) {
    querySrv.getQueryResults(qVentas.getVentaPorId, [req.params.ventas_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getDetalleVentaPorVentasId = function (req, res) {
    querySrv.getQueryResults(qVentas.getDetalleVentaPorVentasId, [req.params.ventas_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}



//-----------> PAGINACION INICIO :
exports.getCantidadPaginasVentas = function (req, res) {
    querySrv.getQueryResults(qVentas.getCantidadPaginasVentas, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getCantidadPaginasVentasTxt = function (req, res) {
    //Preparación de los parámetros para la consulta
    let parametrosBusqueda = ``;
    const habilitarBusquedaFecha = parseInt(req.params.busca_fecha);
    const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    const habilitarBusquedaVendedor = parseInt(req.params.busca_vendedor);
    const habilitarBusquedaMonto = parseInt(req.params.busca_monto);
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

    //Consulta
    const query = ` 
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
        ${parametrosBusqueda}
        ORDER BY fecha desc, v.id
    )x `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));

}

exports.getVentas = function (req, res) {
    const query = ` 
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
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END) -1))
    LIMIT 5 `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getVentasTxt = function (req, res) {
    //Preparación de parámetros para la consulta
    let parametrosBusqueda = ``;
    const habilitarBusquedaFecha = parseInt(req.params.busca_fecha);
    const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    const habilitarBusquedaVendedor = parseInt(req.params.busca_vendedor);
    const habilitarBusquedaMonto = parseInt(req.params.busca_monto);
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
    //Consulta
    const query = ` 
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
    ${parametrosBusqueda}
    ORDER BY fecha desc, v.id
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}
//<------------------PAGINACION FIN

exports.getVentasDiariasEmpleados = function (req, res) {
    querySrv.getQueryResults(qVentas.ventasDiariasEmpleados, [req.params.fecha])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getUltimasVentas = function (req, res) {
    querySrv.getQueryResults(qVentas.ultimasVentas, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getUltimasVentasEmpleado = function (req, res) {
    querySrv.getQueryResults(qVentas.ultimasVentasEmpleado, [req.params.empleados_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.estadisticasVentasDiarias = function (req, res) {
    querySrv.getQueryResults(qVentas.estadisticasVentasDiarias, [req.params.fecha_desde, req.params.fecha_hasta])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.estadisticasVentasDiariasEmpleado = function (req, res) {
    querySrv.getQueryResults(qVentas.estadisticasVentasDiariasEmpleado, [req.params.fecha_desde, req.params.fecha_hasta, req.params.empleados_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

/* ---------------------------POST---------------------------- */
exports.insertVentaReturningFactura = function (req, res) {
    const clientes_id = req.body.cliente.clientes_id;
    const empleados_id = req.body.vendedor.empleados_id;
    const empresas_id = req.body.vendedor.empresas_id;
    const monto_total = req.body.monto_total;
    try {
        const pool = poolSrv.getInstance().getPool();
        pool.connect((err, client, release) => {
            if (err) {
                res.status(400).send(JSON.stringify({ "mensaje": `Pool Error ${err}` }));
            } else {
                let ventas_id = -1;
                client.query(qVentas.insertReturnId, [monto_total, empresas_id, empleados_id, clientes_id], (err_vta, res_vta) => {
                    
                    if (err_vta) {
                        res.status(400).send(JSON.stringify({ "mensaje": "No se obtubieron datos" }));
                        return;
                    }
                    ventas_id = res_vta.rows[0].id;
                    for (let i = 0; i < detalles.length; i++) {
                        client.query(qVentas.insertDetalleReturnId, [detalles[i].cantidad, detalles[i].producto.precio_actual, detalles[i].descuento, detalles[i].subtotal, ventas_id, detalles[i].producto.productos_id], (err_dvta, res_dvta) => {
                            if (err_dvta) {
                                console.error('Ocurrio un error cargar el detalle de la venta: ' + err_dvta.stack);
                            }
                        });

                    }
                    
                    release();
                    res.status(200).send({ "mensaje": "La venta se cargo exitosamente", "insertado": ventas_id });
                });
            }
        })
    } catch (err) {
        res.status(400).send({ 'error': `${err}` });
    }

}

/* ---------------------------PUT---------------------------- */

exports.anularVenta = function (req, res) {
    querySrv.getQueryResults(qVentas.anularVenta, [usuario, ventas_id])
    .then(response => res.send({ "mensaje": "La venta se anulo exitosamente" }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
    
}
