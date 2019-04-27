//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;


exports.getProductosTodos = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
            SELECT 
                  p.*
                , pc.*
                , cat.nombre as nombre_categoria
                , roma.get_imagen_principal_producto(p.id) as imagen
            FROM roma.productos p
            JOIN roma.productos_categorias pc ON p.id = pc.productos_id
            JOIN roma.categorias cat ON pc.categorias_id = cat.id
             `)
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

exports.getProductosBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
            SELECT 
                p.*
              , pc.*
              , cat.nombre as nombre_categoria
              , roma.get_imagen_principal_producto(p.id) as imagen
            FROM roma.productos p
            JOIN roma.productos_categorias pc ON p.id = pc.productos_id
            JOIN roma.categorias cat ON pc.categorias_id = cat.id
            WHERE (p.codigo::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR p.nombre ilike '%`+ req.params.texto_busqueda + `%'
                    OR descripcion ilike '%`+ req.params.texto_busqueda + `%'
                    OR cat.nombre ilike '%`+ req.params.texto_busqueda + `%'
                    OR tipo_producto) ilike '%`+ req.params.texto_busqueda + `%')`
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

exports.getDatosProductos = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                respuesta = await pool.query(`
                SELECT *, roma.get_imagen_principal_producto(pr.id) as imagen
                FROM roma.productos pr
                JOIN roma.precios_productos prp ON pr.id = prp.productos_id             
                WHERE pr.id = `+ req.params.id + ` `)
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


exports.getCaracteristicasProductos = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                respuesta = await pool.query(`
                SELECT * 
                FROM roma.productos_caracteristicas             
                WHERE productos_id = `+ req.params.id + ` `)
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


exports.getCategoriasProductos = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                respuesta = await pool.query(`
                SELECT cat.id as categorias_id, cat.nombre 
                FROM roma.productos_categorias pc
                JOIN roma.categorias cat ON pc.categorias_id = cat.id    
                WHERE productos_id = `+ req.params.id + ` `)
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


exports.insertProductoReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            let codigo = (req.body.codigo != undefined) ?  `'` + req.body.codigo + `'` : `null`;
            let nombre = (req.body.nombre_producto != undefined) ? `'` + req.body.nombre_producto + `'` : `null`;
            let descripcion = (req.body.descripcion_producto != undefined) ? `'` + req.body.descripcion_producto + `'` : `null`;
            let descripcion_factura = (req.body.descripcion_factura != undefined) ? `'` + req.body.descripcion_factura + `'` : `null`;
            let tipo_producto = (req.body.tipo != undefined) ? req.body.tipo : `null`;
            let fecha_desde = (req.body.fecha_desde != undefined) ? `'` + req.body.fecha_desde + `'` : `now()::date`;
            let fecha_hasta = (req.body.fecha_hasta != undefined) ? `'` + req.body.fecha_hasta + `'` : `now()::date`;


            await client.query('BEGIN')

            const { rows } = await client.query(`

            INSERT INTO roma.productos (codigo
                , nombre
                , descripcion
                , descripcion_factura
                , tipo_producto
                , fecha_desde)
            VALUES(`+ codigo + `
                , `+ nombre + `
                , `+ descripcion + `
                , `+ descripcion_factura + `
                , `+ tipo_producto + `
                , now()::date
                ) RETURNING id; `)

            const { precios_productos } = await client.query(`
            INSERT INTO roma.precios_productos(
                  monto
                , unidad
                , fecha_desde
                , productos_id
                )
            VALUES(
                  `+ req.body.precio + `
                , `+ req.body.unidad + `
                , now()::date
                , `+ rows[0].id + `
                )`)

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

exports.insertCaracteristicasProducto = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            await client.query(`
            INSERT INTO roma.productos_caracteristicas(
                  nombre
                , descripcion
                , unidad_medida
                , valor
                , productos_id)
            VALUES(
                  '`+ req.body.nombre + `'
                , '`+ req.body.descripcion + `'
                , `+ req.body.unidad_medida + `
                , `+ req.body.valor + `
                , `+ req.body.productos_id + `); `)

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

exports.insertCategoriasProducto = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            await client.query(`
            INSERT INTO roma.productos_categorias(
                  productos_id
                , categorias_id)
            VALUES(
                  `+ req.body.productos_id + `
                , `+ req.body.categorias_id + ` ); `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "Las Categorias se cargaron exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar las Categorias" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};


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
            res.status(400).send({ "mensaje": "Ocurrio un error actualizar al fallecido" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};





exports.eliminarCaracteristicasProductos = function (req, res) {

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
