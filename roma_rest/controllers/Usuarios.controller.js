//Conexión a Postgres
const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;

async function generarTokenString(usuario, identificador) {
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        var token_generado = '';
        const client = await pool.connect();
        await client.query(`
            SELECT seguridad.generar_token('`+ usuario + `', '` + identificador + `') as token_acceso;`
            , ((err, resp) => {
                if (err) console.log(err);
                token_generado = resp.rows[0].token_acceso;
                console.log("Token Generado en BD: " + token_generado);
                return token_generado;
            }))
    }
    catch (error) {
        return "ERROR: " + error;
    }
}


function generarToken(usuario, token_bd, llave_privada) {
    try {
        console.log(process.env);
        let token = jwt.sign({ "token": token_bd }, llave_privada, {
            subject: usuario,
            expiresIn: 60 * 60 * 24 // expira en 24 horas
        })
        console.log(token);
        return token;
    } catch (err) {
        console.log(err);
    }

}

exports.solicitarAccesoUsuario = async function (req, res) {
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });

        let acceso = await pool.query(`
            SELECT count(*)>0 as permitir_acceso
            FROM seguridad.usuarios 
            WHERE pwd_usr = md5('`+ req.params.pswrd + `')
                AND nomb_usr = '`+ req.params.nomb_usr + `'
                AND habilitado = true
                AND coalesce(fecha_baja, now())>=now();
                `);
        console.log(acceso.rows[0].permitir_acceso);

        if (acceso.rows[0].permitir_acceso) {
            let token_generado = generarTokenString(req.params.nomb_usr, req.params.pswrd).then(
                function () {
                    res.status(200).send(JSON.stringify({ respuesta: generarToken(req.params.nomb_usr, token_generado, configuracion.llave) }));
                }
            ).catch(function () {
                res.status(400).send(JSON.stringify({ "error": "Error al generar el token" }));
            })

        }
        else {
            res.status(400).send(JSON.stringify({ "error": "Usuario y/o contraseña incorrectos" }));
        }

    } catch (err) {
        res.status(400).send({ "error": err.stack });
    }
};



exports.getDatosUsuario = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT usr.nomb_usr as usuario
                    , usr.desc_usr as descripcion_usuario
                    , usr.debug
                    , prs.apellido
                    , prs.nombre
                    , prs.email
                    , emp.legajo
                    , emp.descripcion as descripcion_empleado
                FROM seguridad.usuarios usr
                JOIN public.personas prs ON usr.personas_id = prs.id
                JOIN roma.empleados emp ON emp.personas_id = prs.id
                WHERE usr.nomb_usr =  '`+ req.params.usuario + `';`)
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



exports.getUsuariosTodos = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT * 
                FROM seguridad.usuarios usr
                JOIN public.personas p ON usr.personas_id = p.id `)
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

exports.getUsuariosBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
            SELECT *
            FROM seguridad.usuarios usr
            JOIN public.personas p ON usr.personas_id = p.id
            WHERE (p.nombre::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR p.apellido::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR usr.nomb_usr ilike '%`+ req.params.texto_busqueda + `%'
                    OR usr.desc_usr ilike '%`+ req.params.texto_busqueda + `%'
                    OR p.nro_doc::varchar ilike '%`+ req.params.texto_busqueda + `%')`
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


exports.insertUsuarioReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            var debug = 0;
            let personas_id = (req.body.personas_id != undefined) ? req.body.personas_id : `null`;
            let nomb_usr = (req.body.nombre_usuario != undefined) ? `'` + req.body.nombre_usuario + `'` : `null`;
            let usuario = (req.body.usuario != undefined) ? `'` + req.body.usuario + `'` : `null`;
            let check_debug = (req.body.chk_debug != undefined) ? req.body.chk_debug : `null`;

            if (check_debug) {
                debug = 1;
            } else {
                debug = 0;
            }

            console.log("Personas_id:"+ personas_id);
            await client.query('BEGIN')

            const { rows } = await client.query(`
            INSERT INTO seguridad.usuarios (nomb_usr
                , pwd_usr
                , usuario
                , fecha_mov
                , debug
                , personas_id
            )
            VALUES(`+ nomb_usr + `
                , md5('12345')
                , `+ usuario + `
                , now()::date
                , `+ debug + `
                , `+ personas_id + `
                ) RETURNING id; `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El USUARIO fue guardado exitosamente", "id": rows[0].id });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el producto" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



exports.actualizarDatosUsuarios = function (req, res) {
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




exports.getDatosUsuariosCargados = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                respuesta = await pool.query(`
                SELECT * 
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




