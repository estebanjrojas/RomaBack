//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const querySrv = require("../services/QueryService");
const qProductos = require("./query/Productos.js");
//------------------------------GET------------------------------//

exports.getProductosTodos = function (req, res) {
    querySrv.getQueryResults(qProductos.getProductosTodos, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getProductosBusqueda = function (req, res) {
    querySrv.getQueryResults(qProductos.getProductosBusqueda, [req.params.texto_busqueda])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getDatosProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getDatosProductos, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCaracteristicasProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getCaracteristicasProductos, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCategoriasProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getCategoriasProductos, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getUltimoPrecioValido = function (req, res) {
    querySrv.getQueryResults(qProductos.getUltimoPrecioValido, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getHistorialPrecios = function (req, res) {
    querySrv.getQueryResults(qProductos.getHistorialPrecios, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getImagenesProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getImagenesProductos, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getProductosPorCategoriaCampoBusqueda = function (req, res) {
    querySrv.getQueryResults(qProductos.getProductosPorCategoriaCampoBusqueda, [req.params.categorias_id, req.params.campo_buscar, req.params.texto_buscar])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getFotosCargadas = function (req, res) {
    querySrv.getQueryResults(qProductos.getFotosCargadas, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

//-----------> PAGINACION INICIO :
exports.getCantidadPaginasProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getCantidadPaginasProductos, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
};

exports.getCantidadPaginasProductosTxt = function (req, res) {

    let parametrosBusqueda = ``;
    const habilitarBusquedaCodigo = parseInt(req.params.busca_codigo);
    const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    const habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    const habilitarBusquedaCategoria = parseInt(req.params.busca_categoria);

    if ((habilitarBusquedaCodigo + habilitarBusquedaNombre +
        habilitarBusquedaDescripcion + habilitarBusquedaCategoria) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE `;
        if (habilitarBusquedaCodigo == 1) {
            parametrosBusqueda = parametrosBusqueda + `p.codigo::varchar ilike '%` + req.params.txt + `%'`;
        }
        if (habilitarBusquedaNombre == 1) {
            if (habilitarBusquedaCodigo == 0) {
                parametrosBusqueda = parametrosBusqueda + `p.nombre::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR p.nombre::varchar ilike '%` + req.params.txt + `%'`;
            }
        }

        if (habilitarBusquedaDescripcion == 1) {
            if (habilitarBusquedaCodigo + habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `p.descripcion::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR p.descripcion::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
        if (habilitarBusquedaCategoria == 1) {
            if ((habilitarBusquedaCodigo + habilitarBusquedaNombre + habilitarBusquedaDescripcion) == 0) {
                parametrosBusqueda = parametrosBusqueda + `cat.nombre::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR cat.nombre::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
    }

    const query = ` 
    SELECT 
        COUNT(*) as cantidad_registros,
        (COUNT(*)/5 )+ (CASE WHEN COUNT(*) % 5 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
    FROM (
        SELECT 
                p.id as productos_id
            ,  p.*
            , pc.*
            , cat.nombre as nombre_categoria
            , roma.get_imagen_principal_producto(p.id) as imagen
        FROM roma.productos p
        JOIN roma.productos_categorias pc ON p.id = pc.productos_id
        JOIN roma.categorias cat ON pc.categorias_id = cat.id
        ${parametrosBusqueda}
    )x `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));

}

exports.getProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.getProductos, [req.params.paginaActual, req.params.cantidadPaginas])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getProductosTxt = function (req, res) {
    let parametrosBusqueda = ``;
    const habilitarBusquedaCodigo = parseInt(req.params.busca_codigo);
    const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    const habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    const habilitarBusquedaCategoria = parseInt(req.params.busca_categoria);

    if ((habilitarBusquedaCodigo + habilitarBusquedaNombre +
        habilitarBusquedaDescripcion + habilitarBusquedaCategoria) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE `;
        if (habilitarBusquedaCodigo == 1) {
            parametrosBusqueda = parametrosBusqueda + `p.codigo::varchar ilike '%` + req.params.txt + `%'`;

        }
        if (habilitarBusquedaNombre == 1) {
            if (habilitarBusquedaCodigo == 0) {
                parametrosBusqueda = parametrosBusqueda + `p.nombre::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR p.nombre::varchar ilike '%` + req.params.txt + `%'`;
            }

        }

        if (habilitarBusquedaDescripcion == 1) {
            if (habilitarBusquedaCodigo + habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `p.descripcion::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR p.descripcion::varchar ilike '%` + req.params.txt + `%'`;
            }

        }
        if (habilitarBusquedaCategoria == 1) {
            if ((habilitarBusquedaCodigo + habilitarBusquedaNombre + habilitarBusquedaDescripcion) == 0) {
                parametrosBusqueda = parametrosBusqueda + `cat.nombre::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR cat.nombre::varchar ilike '%` + req.params.txt + `%'`;
            }

        }
    }

    const query = ` 
    SELECT p.id as productos_id
            ,  p.*
            , pc.*
            , cat.nombre as nombre_categoria
            , roma.get_imagen_principal_producto(p.id) as imagen
    FROM roma.productos p
    JOIN roma.productos_categorias pc ON p.id = pc.productos_id
    JOIN roma.categorias cat ON pc.categorias_id = cat.id
    ${parametrosBusqueda}
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;
    
    querySrv.getQueryResults(query, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}
//<------------------PAGINACION FIN


exports.getNovedadesProductosLimit = async function (req, res) {
    querySrv.getQueryResults(qProductos.getNovedadesProductosLimit, [req.params.fecha_desde, req.params.fecha_hasta, req.params.limit])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}
//------------------------------POST------------------------------//

exports.insertProductoReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            let codigo = (req.body.codigo != undefined) ? `'` + req.body.codigo + `'` : `null`;
            let nombre = (req.body.nombre_producto != undefined) ? `'` + req.body.nombre_producto + `'` : `null`;
            let descripcion = (req.body.descripcion_producto != undefined) ? `'` + req.body.descripcion_producto + `'` : `null`;
            let descripcion_factura = (req.body.descripcion_factura != undefined) ? `'` + req.body.descripcion_factura + `'` : `null`;
            let tipo_producto = (req.body.tipo != undefined) ? req.body.tipo : `null`;
            let fecha_desde = (req.body.fecha_desde != undefined) ? `'` + req.body.fecha_desde + `'` : `now()::date`;
            let fecha_hasta = (req.body.fecha_hasta != undefined) ? `'` + req.body.fecha_hasta + `'` : `now()::date`;


            await client.query('BEGIN')

            const { rows } = await client.query(qProductos.insertProductosReturningId, [codigo, nombre, descripcion, descripcion_factura, tipo_producto])

            const { precios_productos } = await client.query(qProductos.insertPreciosProductos, [req.body.precio, req.body.unidad, rows[0].id])

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El Producto fue guardado exitosamente", "id": rows[0].id });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el producto" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};

exports.insertNuevoPrecioProducto = function (req, res) {
    querySrv.getQueryResults(qProductos.insertNuevoPrecioProducto, [req.body.precio, req.body.productos_id])
    .then(response => res.send({ "mensaje": "El Precio se cargo exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.insertCaracteristicasProducto = function (req, res) {
    querySrv.getQueryResults(qProductos.insertCaracteristicasProducto, [req.body.nombre, req.body.descripcion, req.body.valor, req.body.productos_id])
    .then(response => res.send({ "mensaje": "Las Caracteristicas se cargaron exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.eliminarCategoriasProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.eliminarCategoriasProductos, [req.params.productos_id])
    .then(response => res.send({ "mensaje": "La Categoria se elimino exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.insertCategoriasProducto = function (req, res) {
    querySrv.getQueryResults(qProductos.insertCategoriasProducto, [req.body.productos_id, req.body.categorias_id])
    .then(response => res.send({ "mensaje": "La Categoria y producto se relaciono exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.insertEmpleadoPersonaDomicilio = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            //Parametros para insertar el domicilio
            let calle = (req.body.domicilio.calle != undefined) ? `'` + req.body.domicilio.calle + `'` : `null`;
            let numero = (req.body.domicilio.numero != undefined) ? `'` + req.body.domicilio.numero + `'` : `null`;
            let piso = (req.body.domicilio.piso != undefined) ? `'` + req.body.domicilio.piso + `'` : `null`;
            let depto = (req.body.domicilio.depto != undefined) ? `'` + req.body.domicilio.depto + `'` : `null`;
            let manzana = (req.body.domicilio.manzana != undefined) ? `'` + req.body.domicilio.manzana + `'` : `null`;
            let lote = (req.body.domicilio.lote != undefined) ? `'` + req.body.domicilio.lote + `'` : `null`;
            let block = (req.body.domicilio.block != undefined) ? `'` + req.body.domicilio.block + `'` : `null`;
            let barrio = (req.body.domicilio.barrio != undefined) ? `'` + req.body.domicilio.barrio + `'` : `null`;
            let ciudades_id = (req.body.domicilio.ciudades_id != undefined) ? `'` + req.body.domicilio.ciudades_id + `'` : `null`;
            //Parametros para insertar la persona
            let nro_doc = (req.body.nro_doc != undefined) ? req.body.nro_doc : `null`;
            let tipo_doc = (req.body.tipo_doc != undefined) ? req.body.tipo_doc : `null`;
            let apellido = (req.body.apellido != undefined) ? `'` + req.body.apellido + `'` : `null`;
            let nombre = (req.body.nombre != undefined) ? `'` + req.body.nombre + `'` : `null`;
            let telefono = (req.body.telefono != undefined) ? req.body.telefono : `null`;
            let celular = (req.body.telefono_cel != undefined) ? req.body.telefono_cel : `null`;
            let email = (req.body.email != undefined) ? `'` + req.body.email + `'` : `null`;
            let fecha_nac = (req.body.fecha_nac != undefined) ? `'` + req.body.fecha_nac + `'` : `null`;
            let sexo = (req.body.sexo != null) ? req.body.sexo : `null`;
            let tipo_persona = (req.body.tipo_persona != undefined) ? req.body.tipo_persona : `null`;
            let ip = `'` + req.ip + `'`;
            let usuario = (req.body.usuario != undefined) ? `'` + req.body.usuario + `'` : `null`;
            let estado_civil = (req.body.estado_civil != undefined) ? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese != undefined) ? `'` + req.body.fecha_cese + `'` : `null`;
            let usuario_carga = (req.body.usuario_carga != undefined) ? `'` + req.body.usuario_carga + `'` : `null`;
            let ip_carga = (req.body.ip_carga != undefined) ? `'` + req.body.ip_carga + `'` : `null`;
            let fecha_carga = (req.body.fecha_carga != undefined) ? `'` + req.body.fecha_carga + `'` : `null`;
            let telefono_caracteristica = (req.body.telefono_caracteristica != undefined) ? `'` + req.body.telefono_caracteristica + `'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica != undefined) ? `'` + req.body.celular_caracteristica + `'` : `null`;
            //Parametros para insertar el empleado
            let legajo = (req.body.legajo != undefined) ? req.body.legajo : `null`;
            let fecha_ingreso = (req.body.fecha_ingreso != undefined) ? `'` + req.body.fecha_ingreso + `'` : `now()::date`;
            let descripcion = (req.body.descripcion != undefined) ? `'` + req.body.descripcion + `'` : `null`;
            let empresas_id = (req.body.empresas_id != undefined) ? req.body.empresas_id : `null`;
            let oficina = (req.body.oficina != undefined) ? req.body.oficina : `null`;

            await client.query('BEGIN')

            const { domicilio } = await client.query(`
            INSERT INTO domicilios(calle, numero, piso, depto
                , manzana, lote, block, barrio, ciudades_id)
            VALUES(`+ calle + `, ` + numero + `, ` + piso + `, ` + depto + `
            , `+ manzana + `, ` + lote + `, ` + block + `, ` + barrio + `, ` + ciudades_id + `)
            RETURNING id;`)

            const { persona } = await client.query(`
            INSERT INTO personas(nro_doc, tipo_doc
                , apellido, nombre
                , telefono, telefono_cel, email
                , fecha_nac, sexo, tipo_persona
                , fecha_create, ip, usuario, fecha_mov
                , estado_civil
                , fecha_cese, usuario_carga, ip_carga, fecha_carga
                , telefono_caracteristica, celular_caracteristica
                , domicilios_id)
            VALUES(`+ nro_doc + `, ` + tipo_doc + `
                , `+ apellido + `, ` + nombre + `
                , `+ telefono + `, ` + celular + `, ` + email + `
                , `+ fecha_nac + `, ` + sexo + `, ` + tipo_persona + `
                , now(), `+ ip + `, ` + usuario + `, now()
                , `+ estado_civil + `
                , `+ fecha_cese + `, ` + usuario_carga + `, ` + ip_carga + `, ` + fecha_carga + `
                , `+ telefono_caracteristica + `, ` + celular_caracteristica + `
                , `+ domicilio[0].id + `
                ) RETURNING id; `)

            const { empleado } = await client.query(`
            INSERT INTO roma.empleados (personas_id, legajo, fecha_ingreso, descripcion, empresas_id, oficina)
            VALUES(`+ persona[0].id + `, ` + legajo + `, ` + fecha_ingreso + `
                , `+ descripcion + `, ` + empresas_id + `, ` + oficina + `
                ) RETURNING *; `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "La persona se cargo exitosamente", "insertado": empleado[0] });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};





exports.cargarImagenProducto = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            /*await client.query(`
            DELETE FROM flores_avisos.salas_fallecidos_fotos 
            WHERE salas_fallecidos_id = `+ req.body.salas_fallecidos_id + ``)
            */
            await client.query(`
            INSERT INTO roma.productos_imagenes(productos_id
                , imagen, fecha_carga, principal)
            VALUES(`+ req.body.productos_id + `
                , '`+ req.body.imagen + `', now(), ` + req.body.predeterminada + `); `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "La imagen se cargo exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la imagen" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};


//------------------------------PUT------------------------------//


exports.actualizarDatosProductos = function (req, res) {
    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            let codigo = (req.body.codigo != undefined) ? req.body.codigo : `null`;
            let nombre = (req.body.nombre_producto != undefined) ? `'` + req.body.nombre_producto + `'` : `null`;
            let descripcion = (req.body.descripcion_producto != undefined) ? `'` + req.body.descripcion_producto + `'` : `null`;
            let descripcion_factura = (req.body.descripcion_factura != undefined) ? `'` + req.body.descripcion_factura + `'` : `null`;
            let tipo_producto = (req.body.tipo != undefined) ? req.body.tipo : `null`;

            await client.query('BEGIN')
            const { rows } = await client.query(`
            UPDATE roma.productos
            SET 
                codigo= `+ codigo + `, 
                nombre= `+ nombre + `, 
                descripcion= `+ descripcion + `, 
                descripcion_factura= `+ descripcion_factura + `, 
                tipo_producto= `+ tipo_producto + `, 
                fecha_desde= now()::date 
            WHERE id ='`+ req.body.id_producto + `' returning id`)


            const { precios_productos } = await client.query(`
            UPDATE roma.precios_productos
            SET 
                monto= `+ req.body.precio + `, 
                unidad= `+ req.body.unidad + `, 
                fecha_desde= now()::date
            WHERE productos_id = '`+ req.body.id_producto + `'`)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El Producto fue actualizado exitosamente", "id": rows[0].id });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error actualizar el producto" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



exports.actualizarFechaHastaPrecio = function (req, res) {
    querySrv.getQueryResults(qProductos.actualizarFechaHastaPrecio, [req.body.productos_id])
    .then(response => res.send({ "mensaje": "La fecha de cese fue actualizada exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}


//------------------------------DELETE------------------------------//

exports.eliminarCaracteristicasProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.eliminarCaracteristicasProductos, [req.params.productos_id])
    .then(response => res.send({ "mensaje": "Las caracteristicas del producto se eliminaron exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}


exports.eliminarImagenesProductos = function (req, res) {
    querySrv.getQueryResults(qProductos.eliminarImagenesProductos, [req.params.productos_id])
    .then(response => res.send({ "mensaje": "Las imagenes del producto se eliminaron exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}



