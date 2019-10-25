//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qPersonas = require("../controllers/query/Personas");
const qDomicilios = require("../controllers/query/Domicilios");
const qClientes = require("../controllers/query/Clientes");
var ip = require('ip');



//----------------------------------GET----------------------------------//

exports.getClientesTodos = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
                FROM roma.clientes cli
                JOIN personas p ON cli.personas_id = p.id  `)
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

exports.getClientesBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
            SELECT cli.id as clientes_id, *
            FROM roma.clientes cli
            JOIN personas p ON cli.personas_id = p.id 
            WHERE (p.nro_doc::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR p.nombre::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR p.apellido ilike '%`+ req.params.texto_busqueda + `%')`
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



exports.getClientesWhere = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT cli.id as clientes_id, cli.fecha_alta
                    , p.*, gdt(1, p.tipo_doc) as tipo_doc_descrip
                    , dm.calle, dm.numero as domicilio_numero
                    , dm.piso, dm.depto, dm.manzana, dm.lote, dm.block, dm.barrio, dm.ciudades_id
                    , cl.codigo_postal, cl.nombre as ciudad_nombre
                    , pv.id as provincias_id, pv.nombre as provincias_nombre
                    , pc.id as paices_id, pc.nombre as pais_nombre
                FROM roma.clientes cli
                JOIN personas p ON cli.personas_id = p.id
                LEFT JOIN domicilios dm ON p.domicilios_id = dm.id
                LEFT JOIN ciudades cl ON dm.ciudades_id = cl.id
                LEFT JOIN provincias pv ON cl.provincias_id = pv.id
                LEFT JOIN paises pc ON pv.paises_id = pc.id 
                WHERE ${req.params.campo_busqueda}::varchar ilike '%${req.params.texto_buscar}%'`
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
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }

};



exports.getDatosClientePorId = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT 
                      cli.id as clientes_id
                    , cli.personas_id
                    , ps.*
                    , dom.*
                    , ciu.id as ciudades_id
                    , ciu.nombre as ciudad_nombre
                    , prov.id as provincias_id
                    , ps.id as personas_id
                    , dom.id as domicilios_id
                FROM roma.clientes cli
                LEFT JOIN personas ps ON cli.personas_id = ps.id
                LEFT JOIN domicilios dom ON ps.domicilios_id = dom.id
                LEFT JOIN ciudades ciu ON dom.ciudades_id = ciu.id
				LEFT JOIN provincias prov ON ciu.provincias_id = prov.id
                WHERE cli.id =  `+ req.params.id)
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
exports.getCantidadPaginasClientes = function (req, res) {
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
                    COUNT(*) as cantidad_registros,
                    (COUNT(*)/5 )+ (CASE WHEN COUNT(*) % 5 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
                FROM (
                    SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
                    FROM roma.clientes cli
                    JOIN personas p ON cli.personas_id = p.id
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

exports.getCantidadPaginasClientesTxt = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        let parametrosBusqueda = ``;
        let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
        let habilitarBusquedaApellido = parseInt(req.params.busca_apellido);
        let habilitarBusquedaDni = parseInt(req.params.busca_dni);
        let habilitarBusquedaFechaNac = parseInt(req.params.busca_fecha_nac);
        console.log('parametros' + habilitarBusquedaNombre
            + '/' + habilitarBusquedaApellido
            + '/' + habilitarBusquedaDni
            + '/' + habilitarBusquedaFechaNac);
        if ((habilitarBusquedaNombre + habilitarBusquedaApellido +
            habilitarBusquedaDni + habilitarBusquedaFechaNac) > 0) {
            parametrosBusqueda = parametrosBusqueda + ` WHERE `;
            if (habilitarBusquedaNombre == 1) {
                parametrosBusqueda = parametrosBusqueda + `p.nombre::varchar ilike '%` + req.params.txt + `%'`;
                console.log('entro al primero');
            }
            if (habilitarBusquedaApellido == 1) {
                if (habilitarBusquedaNombre == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.apellido::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.apellido::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al segundo');
            }

            if (habilitarBusquedaDni == 1) {
                if (habilitarBusquedaApellido + habilitarBusquedaNombre == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.nro_doc::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.nro_doc::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al tercero');
            }
            if (habilitarBusquedaFechaNac == 1) {
                if ((habilitarBusquedaNombre + habilitarBusquedaApellido + habilitarBusquedaDni) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.fecha_nac::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.fecha_nac::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al cuarto');
            }
        }
        try {
            (async () => {
                query = ` 
                SELECT 
                    COUNT(*) as cantidad_registros,
                    (COUNT(*)/5 )+ (CASE WHEN COUNT(*) % 5 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
                FROM (
                    SELECT cli.id AS clientes_id, cli.fecha_alta, p.id AS personas_id, p.* 
                    FROM roma.clientes cli
                    JOIN personas p ON cli.personas_id = p.id
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
        res.status(400).send({ 'mensaje': 'Ocurrio un Error', "error": err });
    }
};

exports.getClientes = function (req, res) {
    try {
        let query = ``;
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {
                query = ` 
                SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
                FROM roma.clientes cli
                JOIN personas p ON cli.personas_id = p.id 
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

exports.getClientesTxt = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        let query = ``;
        var pool = new Pool({
            connectionString: connectionString,
        });
        let parametrosBusqueda = ``;
        let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
        let habilitarBusquedaApellido = parseInt(req.params.busca_apellido);
        let habilitarBusquedaDni = parseInt(req.params.busca_dni);
        let habilitarBusquedaFechaNac = parseInt(req.params.busca_fecha_nac);
        console.log('parametros' + habilitarBusquedaNombre
            + '/' + habilitarBusquedaApellido
            + '/' + habilitarBusquedaDni
            + '/' + habilitarBusquedaFechaNac);
        if ((habilitarBusquedaNombre + habilitarBusquedaApellido +
            habilitarBusquedaDni + habilitarBusquedaFechaNac) > 0) {
            parametrosBusqueda = parametrosBusqueda + ` WHERE `;
            if (habilitarBusquedaNombre == 1) {
                parametrosBusqueda = parametrosBusqueda + `p.nombre::varchar ilike '%` + req.params.txt + `%'`;
                console.log('entro al primero');
            }
            if (habilitarBusquedaApellido == 1) {
                if (habilitarBusquedaNombre == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.apellido::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.apellido::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al segundo');
            }

            if (habilitarBusquedaDni == 1) {
                if (habilitarBusquedaApellido + habilitarBusquedaNombre == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.nro_doc::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.nro_doc::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al tercero');
            }
            if (habilitarBusquedaFechaNac == 1) {
                if ((habilitarBusquedaNombre + habilitarBusquedaApellido + habilitarBusquedaDni) == 0) {
                    parametrosBusqueda = parametrosBusqueda + `p.fecha_nac::varchar ilike '%` + req.params.txt + `%'`;
                } else {
                    parametrosBusqueda = parametrosBusqueda + `OR p.fecha_nac::varchar ilike '%` + req.params.txt + `%'`;
                }
                console.log('entro al cuarto');
            }
        }
        try {
            (async () => {
                query = ` 
                SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
                FROM roma.clientes cli
                JOIN personas p ON cli.personas_id = p.id 
                `+ parametrosBusqueda + `
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


//----------------------------------POST----------------------------------//


exports.insertClientePersonaDomicilio = function (req, res) {

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
            //Parametros para insertar el cliente
            let fecha_alta = (req.body.fecha_alta != undefined) ? `'` + req.body.fecha_alta + `'` : `now()::date`;

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

            const { cliente } = await client.query(`
            INSERT INTO roma.clientes (fecha_alta, personas_id)
            VALUES(`+ fecha_alta + `, ` + persona[0].id + `) RETURNING *; `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El cliente se cargo exitosamente", "insertado": cliente[0] });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el cliente" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



exports.insertClientePersonaDomicilio = function (req, res) {

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
            let telefono = (req.body.telefono != undefined) ? `'` + req.body.telefono + `'` : `null`;
            let celular = (req.body.telefono_cel != undefined) ? `'` + req.body.telefono_cel + `'` : `null`;
            let email = (req.body.email != undefined) ? `'` + req.body.email + `'` : `null`;
            let fecha_nac = (req.body.fecha_nac != undefined) ? `'` + req.body.fecha_nac + `'` : `null`;
            let sexo = (req.body.sexo != null) ? req.body.sexo : `null`;
            let tipo_persona = (req.body.tipo_persona != undefined) ? req.body.tipo_persona : `null`;
            let ip = `'` + req.ip + `'`;
            let usuario = (req.body.usuario != undefined) ? `'` + req.body.usuario + `'` : `null`;
            let estado_civil = (req.body.estado_civil != undefined) ? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese != undefined) ? `'` + req.body.fecha_cese + `'` : `null`;
            let usuario_carga = (req.body.usuario_carga != undefined) ? `'` + req.body.usuario_carga + `'` : `null`;
            let ip_carga = `'` + req.ip + `'`;
            let fecha_carga = `now()`;
            let telefono_caracteristica = (req.body.telefono_caracteristica != undefined) ? `'` + req.body.telefono_caracteristica + `'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica != undefined) ? `'` + req.body.celular_caracteristica + `'` : `null`;

            client.query('BEGIN', (err1, res1) => {
                if (err1) {
                    console.log('Ocurrio un error iniciando la transaccion: ' + err1.stack);
                }
                client.query(`
                INSERT INTO domicilios(calle, numero, piso, depto
                    , manzana, lote, block, barrio, ciudades_id)
                VALUES(`+ calle + `, ` + numero + `, ` + piso + `, ` + depto + `
                , `+ manzana + `, ` + lote + `, ` + block + `, ` + barrio + `, ` + ciudades_id + `)
                RETURNING id;`, (err2, res2) => {
                    const domicilio = res2.rows[0].id;
                    console.log("Domicilio Insertado con ID:" + res2.rows[0].id);
                    if (err2) {
                        console.log("Ocurrio un error al guardar el domicilio: " + err2.stack);
                        client.query('ROLLBACK');
                    };

                    console.log(`
                        INSERT INTO personas(
                            nro_doc
                            , tipo_doc
                            , apellido
                            , nombre
                            , telefono
                            , telefono_cel
                            , email
                            , fecha_nac
                            , sexo
                            , tipo_persona
                            , fecha_create
                            , ip
                            , usuario
                            , fecha_mov
                            , estado_civil
                            , fecha_cese
                            , usuario_carga
                            , ip_carga
                            , fecha_carga
                            , telefono_caracteristica
                            , celular_caracteristica
                            , domicilios_id)
                        VALUES(
                            `+ nro_doc + `
                            , `+ tipo_doc + `
                            , `+ apellido + `
                            , `+ nombre + `
                            , `+ telefono + `
                            , `+ celular + `
                            , `+ email + `
                            , `+ fecha_nac + `
                            , `+ sexo + `
                            , `+ tipo_persona + `
                            , now()
                            , `+ ip + `
                            , `+ usuario + `
                            , now()
                            , `+ estado_civil + `
                            , `+ fecha_cese + `
                            , `+ usuario_carga + `
                            , `+ ip_carga + `
                            , `+ fecha_carga + `
                            , `+ telefono_caracteristica + `
                            , `+ celular_caracteristica + `
                            , `+ domicilio + `
                            ) RETURNING id;`);

                    client.query(`
                        INSERT INTO personas(
                              nro_doc
                            , tipo_doc
                            , apellido
                            , nombre
                            , telefono
                            , telefono_cel
                            , email
                            , fecha_nac
                            , sexo
                            , tipo_persona
                            , fecha_create
                            , ip
                            , usuario
                            , fecha_mov
                            , estado_civil
                            , fecha_cese
                            , usuario_carga
                            , ip_carga
                            , fecha_carga
                            , telefono_caracteristica
                            , celular_caracteristica
                            , domicilios_id)
                        VALUES(
                              `+ nro_doc + `
                              , `+ tipo_doc + `
                            , `+ apellido + `
                            , `+ nombre + `
                            , `+ telefono + `
                            , `+ celular + `
                            , `+ email + `
                            , `+ fecha_nac + `
                            , `+ sexo + `
                            , `+ tipo_persona + `
                            , now()
                            , `+ ip + `
                            , `+ usuario + `
                            , now()
                            , `+ estado_civil + `
                            , `+ fecha_cese + `
                            , `+ usuario_carga + `
                            , `+ ip_carga + `
                            , `+ fecha_carga + `
                            , `+ telefono_caracteristica + `
                            , `+ celular_caracteristica + `
                            , `+ domicilio + `
                            ) RETURNING id; `, (err3, res3) => {
                        if (err3) {
                            console.log("Ocurrio un error al guardar la persona: " + err3.stack);
                            client.query('ROLLBACK');
                        };
                        const persona = res3.rows[0].id;

                        client.query(`
                                    INSERT INTO roma.clientes (fecha_alta, personas_id)
                                    VALUES(now(), `+ persona + `) RETURNING *; `, (err4, res4) => {
                            if (err4) {
                                console.log("Ocurrio un error al guardar el empleado: " + err4.stack);
                                client.query('ROLLBACK');
                            }
                            client.query('COMMIT');
                        });

                    });
                });
            })
            res.status(200).send({ "mensaje": "El cliente se cargo exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona" + e.stack });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};



exports.guardarClientePersonaDomicilio = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            //Parametros para insertar el domicilio
            let clientes_id = (req.body.clientes_id != undefined || req.body.clientes_id != '') ? req.body.clientes_id : null;
            let domicilios_id = (req.body.domicilios_id != undefined || req.body.domicilios_id != '') ? req.body.domicilios_id : null;
            let personas_id = (req.body.personas_id != undefined || req.body.personas_id != '') ? req.body.personas_id : null;
            let calle = (req.body.calle != undefined || req.body.calle != '') ? req.body.calle : null;
            let numero = (req.body.numero != undefined || req.body.numero != '') ? req.body.numero : null;
            let piso = (req.body.piso != undefined || req.body.piso != '') ? req.body.piso : null;
            let depto = (req.body.depto != undefined || req.body.depto != '') ? req.body.depto : null;
            let manzana = (req.body.manzana != undefined || req.body.manzana != '') ? req.body.manzana : null;
            let provincias_id = (req.body.provincia != undefined || req.body.provincia != '') ? req.body.provincia : null;
            let ciudades_id = (req.body.ciudades_id != undefined || req.body.ciudades_id != '') ? req.body.ciudades_id : null;

            //Parametros para insertar la persona
            let nro_doc = (req.body.documento != undefined || req.body.documento != '') ? req.body.documento : null;
            let tipo_doc = `1`;
            let apellido = (req.body.apellido != undefined || req.body.apellido != '') ? req.body.apellido : null;
            let nombre = (req.body.nombre != undefined || req.body.nombre != '') ? req.body.nombre : null;
            let fecha_nac = (req.body.fecha_nacimiento != undefined || req.body.fecha_nacimiento != '') ? req.body.fecha_nacimiento : null;
            let sexo = (req.body.sexo != undefined || req.body.sexo != '') ? req.body.sexo : null;
            let telefono = (req.body.telefono != undefined || req.body.telefono != '') ? req.body.telefono : null;
            let celular = (req.body.celular != undefined || req.body.celular != '') ? req.body.celular : null;
            let email = (req.body.email != undefined || req.body.email != '') ? req.body.email : null;
            let tipo_persona = `2`;
            let usuario = (req.body.nombre_usuario != undefined || req.body.nombre_usuario != '') ? req.body.nombre_usuario : null;
            //let fecha_carga = 'now()';


            //Parametros nulos
            let tipo_domicilio = 2;



            let query1;
            if (domicilios_id == undefined || domicilios_id == 'null') {
                query1 = {
                    name: 'insert-domicilios',
                    text: qDomicilios.insertDomiciliosReturnId,
                    values: [calle, numero, piso, depto, manzana, ciudades_id]
                };
            }
            else {
                query1 = {
                    name: 'update-domicilios',
                    text: qDomicilios.updateDomicilio,
                    values: [calle, numero, piso, depto, manzana, ciudades_id, domicilios_id]
                };
            }
            console.log({ "query1": query1 });


            client.query('BEGIN', (err1, res1) => {
                if (err1) {
                    console.log('Ocurrio un error iniciando la transaccion: ' + err1.stack);
                }
                client.query(query1, (err2, res2) => {
                    if (query1.name == 'insert-domicilios') { domicilios_id = res2.rows[0].id; }

                    if (err2) {
                        console.log("Ocurrio un error al guardar el domicilio: " + err2);
                        client.query('ROLLBACK');
                    };

                    let query2;
                    if (personas_id == undefined || personas_id == 'null') {
                        query2 = {
                            name: 'insert-personas',
                            text: qPersonas.insertPersonaReturningId,
                            values: [
                                nro_doc, tipo_doc, apellido, nombre,
                                telefono, celular, email, fecha_nac,
                                sexo, tipo_persona, ip.address(), usuario, domicilios_id
                            ]
                        };
                    }
                    else {
                        query2 = {
                            name: 'update-personas',
                            text: qPersonas.updatePersonas,
                            values: [
                                nro_doc, tipo_doc, apellido, nombre,
                                telefono, celular, email, fecha_nac,
                                sexo, tipo_persona, ip.address(), usuario, personas_id, domicilios_id
                            ]
                        };

                    }
                    console.log({ "query2": query2 });

                    client.query(query2, (err3, res3) => {
                        if (err3) {
                            client.query('ROLLBACK');
                        };
                        let query3;
                        if (personas_id == undefined || personas_id == 'null') { personas_id = res3.rows[0].id; }
                        if (clientes_id == undefined || clientes_id == 'null') {
                            query3 = {
                                name: 'insert-clientes',
                                text: qClientes.insertClienteReturnId,
                                values: [personas_id]
                            };
                        } else {
                            query3 = {
                                name: 'update-clientes',
                                text: qClientes.updateClientesDomicilios,
                                values: [personas_id, clientes_id]
                            };
                        }
                        console.log({ "query3": query3 });

                        client.query(query3, (err4, res4) => {
                            if (err4) {
                                console.log("Ocurrio un error al guardar el cliente: " + err4.stack);
                                client.query('ROLLBACK');
                            }

                            client.query('COMMIT');
                        });

                    });

                });
            })
            res.status(200).send({ "mensaje": "El Cementerio se cargo exitosamente" });
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el cementerio: " + e.stack });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};




//----------------------------------PUT----------------------------------//




//----------------------------------DELETE----------------------------------//