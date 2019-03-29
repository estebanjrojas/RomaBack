//Conexión a Postgres
const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;




exports.getPuntosVentaTodos = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT 
                      pv.*
                    , tab.descrip as sucursal_descrip
                FROM roma.puntos_venta pv
                JOIN tabgral tab ON pv.sucursal = tab.codigo AND tab.nro_tab = 6 `)
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

exports.getPuntosVentaBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT 
                      pv.*
                    , tab.descrip as sucursal_descrip
                FROM roma.puntos_venta pv
                JOIN tabgral tab ON pv.sucursal = tab.codigo AND tab.nro_tab = 6
                WHERE (tab.descrip::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR tab.codigo::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR pv.numero ilike '%`+ req.params.texto_busqueda + `%')`
                )
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




exports.insertPuntoVentaReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            let numero = (req.body.numero != undefined) ? req.body.numero : `null`;
            let nombre_usuario = (req.body.nombre_usuario != undefined) ? `'` + req.body.nombre_usuario + `'` : `null`;
            let sucursal = (req.body.sucursal != undefined) ? req.body.sucursal : `null`;
            let fecha_alta = (req.body.fecha_alta != undefined) ? `'` + req.body.fecha_alta + `'` : `now()::date`;
           

            await client.query('BEGIN')

            const { rows } = await client.query(`

            INSERT INTO roma.puntos_venta (
                  numero
                , fecha_alta
                , sucursal)
            VALUES(`+ numero + `
                , `+ fecha_alta + `
                , `+ sucursal + `
                ) RETURNING id; `)

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

exports.insertCaracteristicasPuntoVenta = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            await client.query(`
            INSERT INTO roma.puntos_venta_tipo_comprobantes(
                  ultimo_numero
                , tipo_comprobante
                , defecto
                , puntos_venta_id)
            VALUES(
                  '`+ req.body.ultimo_nro + `'
                , '`+ req.body.tipo + `'
                , `+ req.body.por_defecto + `
                , `+ req.body.punto_venta_id + `); `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "Las Caracteristicas se cargaron exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar las caracteristicas" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};


//Corregir estos dos. Para lunes 1 de abril.
exports.actualizarDatosPuntoVenta = function (req, res) {
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
            res.status(400).send({ "mensaje": "Ocurrio un error actualizar al fallecido" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};

exports.eliminarCaracteristicasPuntoVenta = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            await client.query(`
            DELETE FROM roma.productos_caracteristicas 
            WHERE productos_id = `+ req.params.productos_id + ``)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "Las imagenes se eliminaron exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la imagen" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};