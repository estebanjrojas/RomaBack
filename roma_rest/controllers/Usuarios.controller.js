//Conexión a Postgres
const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qUsuarios = require("./query/Usuarios.js");

async function generarTokenString(usuario, identificador) {
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        var token_generado = '';
        const client = await pool.connect();
        await client.query(qUsuarios.generarTokenString, [usuario, identificador], ((err, resp) => {
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

        let acceso = await pool.query(qUsuarios.solicitarAccesoUsuario, [req.params.pswrd, req.params.nomb_usr]);
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

exports.validarPassVieja = async function (req, res) {
    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            await client.query('BEGIN')
            const { rows } = await client.query(qUsuarios.solicitarAccesoUsuario, [req.params.pswrd, req.params.nomb_usr]);

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El password ingresado es correcto", "permitir_acceso": rows[0].permitir_acceso });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "El password ingresado no es correcto" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



exports.cambiarPassword = function (req, res) {
    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            await client.query('BEGIN')
            const { rows } = await client.query(qUsuarios.cambiarPassword, [req.body.password, req.body.usuario])

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El password fue actualizado exitosamente", "id": rows[0].id });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al actualizar el password" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};

exports.getDatosUsuario = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qUsuarios.getDatosUsuario, [req.params.usuario])
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
                respuesta = await pool.query(qUsuarios.getUsuariosTodos)
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

exports.getUsuariosBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qUsuarios.getUsuariosBusqueda, [req.params.texto_busqueda])
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

            console.log("Personas_id:" + personas_id);
            await client.query('BEGIN')

            const { rows } = await client.query(qUsuarios.insertUsuarioReturnId, [nomb_usr, usuario, debug, personas_id]); 

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


exports.insertPerfilesAsignados = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            let usuarios_id = (req.body.usuarios_id != undefined) ? req.body.usuarios_id : `null`;
            let perfiles_id = (req.body.perfiles_id != undefined) ? req.body.perfiles_id : `null`;

            await client.query('BEGIN')

            const { rows } = await client.query(qUsuarios.insertPerfilesAsignados, [usuarios_id, perfiles_id])

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El Perfil fue guardado exitosamente", "id": rows[0].id });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el Perfil" });
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
        console.log("ID_USUARIO: " + req.params.id_usuario);
        try {
            (async () => {
                respuesta = await pool.query(qUsuarios.getDatosUsuariosCargados, [req.params.id])
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


exports.getPerfilesAsignados = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        console.log("ID_USUARIO: " + req.params.id_usuario);
        try {
            (async () => {
                respuesta = await pool.query(qUsuarios.getPerfilesAsignados, [req.params.id])
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

exports.getPerfilesSinAsignar = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qUsuarios.getPerfilesSinAsignar, [req.params.id])
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



exports.deletePerfiles = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            await client.query(qUsuarios.deletePerfiles, [req.params.id_usuario])

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





