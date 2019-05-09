//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;

exports.insertClientePersonaDomicilio = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            //Parametros para insertar el domicilio
            let calle = (req.body.domicilio.calle!=undefined)? `'`+req.body.domicilio.calle+`'` : `null`;
            let numero = (req.body.domicilio.numero!=undefined)? `'`+req.body.domicilio.numero+`'` : `null`;
            let piso = (req.body.domicilio.piso!=undefined)? `'`+req.body.domicilio.piso+`'` : `null`;
            let depto = (req.body.domicilio.depto!=undefined)? `'`+req.body.domicilio.depto+`'` : `null`;
            let manzana = (req.body.domicilio.manzana!=undefined)? `'`+req.body.domicilio.manzana+`'` : `null`;
            let lote = (req.body.domicilio.lote!=undefined)? `'`+req.body.domicilio.lote+`'` : `null`;
            let block = (req.body.domicilio.block!=undefined)? `'`+req.body.domicilio.block+`'` : `null`;
            let barrio = (req.body.domicilio.barrio!=undefined)? `'`+req.body.domicilio.barrio+`'` : `null`;
            let ciudades_id = (req.body.domicilio.ciudades_id!=undefined)? `'`+req.body.domicilio.ciudades_id+`'` : `null`;
            //Parametros para insertar la persona
            let nro_doc = (req.body.nro_doc!=undefined)? req.body.nro_doc : `null`;
            let tipo_doc = (req.body.tipo_doc!=undefined)? req.body.tipo_doc : `null`;
            let apellido = (req.body.apellido!=undefined)? `'`+req.body.apellido+`'` : `null`;
            let nombre = (req.body.nombre!=undefined)? `'`+req.body.nombre+`'` : `null`;
            let telefono = (req.body.telefono!=undefined)? req.body.telefono : `null`;
            let celular = (req.body.telefono_cel!=undefined)? req.body.telefono_cel : `null`;
            let email = (req.body.email!=undefined)? `'`+req.body.email+`'` : `null`;
            let fecha_nac = (req.body.fecha_nac!=undefined)? `'`+req.body.fecha_nac+`'` : `null`;
            let sexo = (req.body.sexo!=null)? req.body.sexo : `null`;
            let tipo_persona = (req.body.tipo_persona!=undefined)? req.body.tipo_persona : `null`;
            let ip = `'`+req.ip+`'`;
            let usuario = (req.body.usuario!=undefined)? `'`+req.body.usuario+`'` : `null`;
            let estado_civil = (req.body.estado_civil!=undefined)? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese!=undefined)? `'`+req.body.fecha_cese+`'` : `null`;
            let usuario_carga = (req.body.usuario_carga!=undefined)? `'`+req.body.usuario_carga+`'` : `null`;
            let ip_carga = (req.body.ip_carga!=undefined)? `'`+req.body.ip_carga+`'` : `null`;
            let fecha_carga = (req.body.fecha_carga!=undefined)? `'`+req.body.fecha_carga+`'` : `null`;
            let telefono_caracteristica = (req.body.telefono_caracteristica!=undefined)? `'`+req.body.telefono_caracteristica+`'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica!=undefined)? `'`+req.body.celular_caracteristica+`'` : `null`;
            //Parametros para insertar el cliente
            let fecha_alta = (req.body.fecha_alta!=undefined)? `'`+req.body.fecha_alta+`'` : `now()::date`;

            await client.query('BEGIN')

            const { domicilio} = await client.query(`
            INSERT INTO domicilios(calle, numero, piso, depto
                , manzana, lote, block, barrio, ciudades_id)
            VALUES(`+ calle + `, `+ numero + `, `+ piso + `, `+ depto + `
            , `+ manzana + `, `+ lote + `, `+ block + `, `+ barrio + `, `+ciudades_id+`)
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
            VALUES(`+ nro_doc + `, `+ tipo_doc + `
                , `+ apellido + `, `+ nombre + `
                , `+ telefono + `, `+ celular + `, `+ email + `
                , `+ fecha_nac + `, `+ sexo + `, `+ tipo_persona + `
                , now(), `+ ip + `, `+ usuario + `, now()
                , `+ estado_civil + `
                , `+ fecha_cese + `, `+ usuario_carga + `, `+ ip_carga + `, `+ fecha_carga + `
                , `+ telefono_caracteristica + `, `+ celular_caracteristica + `
                , `+ domicilio[0].id + `
                ) RETURNING id; `)

            const { cliente } = await client.query(`
            INSERT INTO roma.clientes (fecha_alta, personas_id)
            VALUES(`+fecha_alta+ `, `+persona[0].id +`) RETURNING *; `)
        
            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El cliente se cargo exitosamente", "insertado": cliente[0]});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el cliente"});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};



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
            SELECT *
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
                SELECT cli.*, p.*, gdt(1, p.tipo_doc) as tipo_doc_descrip
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
                LEFT JOIN paices pc ON pv.paices_id = pc.id 
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

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`             
                SELECT 
                      cli.id as clientes_id
                    , cli.personas_id
                    , ps.*
                    , dom.*
                FROM roma.clientes cli
                JOIN personas ps ON cli.personas_id = ps.id
                LEFT JOIN domicilios dom ON ps.domicilios_id = dom.id
                WHERE cli.id =  `+req.params.id)
                .then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send(JSON.stringify(resp.rows));
                }).catch(err=>{
                    console.error("ERROR", err.stack);
                    res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
                });
                return respuesta;
    
            })()
            
        } catch(error) {
            res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
        }

    }catch(err)
    {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
    
    
};



exports.insertClientePersonaDomicilio = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            //Parametros para insertar el domicilio
            let calle = (req.body.domicilio.calle!=undefined)? `'`+req.body.domicilio.calle+`'` : `null`;
            let numero = (req.body.domicilio.numero!=undefined)? `'`+req.body.domicilio.numero+`'` : `null`;
            let piso = (req.body.domicilio.piso!=undefined)? `'`+req.body.domicilio.piso+`'` : `null`;
            let depto = (req.body.domicilio.depto!=undefined)? `'`+req.body.domicilio.depto+`'` : `null`;
            let manzana = (req.body.domicilio.manzana!=undefined)? `'`+req.body.domicilio.manzana+`'` : `null`;
            let lote = (req.body.domicilio.lote!=undefined)? `'`+req.body.domicilio.lote+`'` : `null`;
            let block = (req.body.domicilio.block!=undefined)? `'`+req.body.domicilio.block+`'` : `null`;
            let barrio = (req.body.domicilio.barrio!=undefined)? `'`+req.body.domicilio.barrio+`'` : `null`;
            let ciudades_id = (req.body.domicilio.ciudades_id!=undefined)? `'`+req.body.domicilio.ciudades_id+`'` : `null`;
            //Parametros para insertar la persona
            let nro_doc = (req.body.nro_doc!=undefined)? req.body.nro_doc : `null`;
            let tipo_doc = (req.body.tipo_doc!=undefined)? req.body.tipo_doc : `null`;
            let apellido = (req.body.apellido!=undefined)? `'`+req.body.apellido+`'` : `null`;
            let nombre = (req.body.nombre!=undefined)? `'`+req.body.nombre+`'` : `null`;
            let telefono = (req.body.telefono!=undefined)? `'`+req.body.telefono+`'` : `null`;
            let celular = (req.body.telefono_cel!=undefined)? `'`+req.body.telefono_cel+`'` : `null`;
            let email = (req.body.email!=undefined)? `'`+req.body.email+`'` : `null`;
            let fecha_nac = (req.body.fecha_nac!=undefined)? `'`+req.body.fecha_nac+`'` : `null`;
            let sexo = (req.body.sexo!=null)? req.body.sexo : `null`;
            let tipo_persona = (req.body.tipo_persona!=undefined)? req.body.tipo_persona : `null`;
            let ip = `'`+req.ip+`'`;
            let usuario = (req.body.usuario!=undefined)? `'`+req.body.usuario+`'` : `null`;
            let estado_civil = (req.body.estado_civil!=undefined)? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese!=undefined)? `'`+req.body.fecha_cese+`'` : `null`;
            let usuario_carga = (req.body.usuario_carga!=undefined)? `'`+req.body.usuario_carga+`'` : `null`;
            let ip_carga = `'`+req.ip+`'`;
            let fecha_carga =  `now()`;
            let telefono_caracteristica = (req.body.telefono_caracteristica!=undefined)? `'`+req.body.telefono_caracteristica+`'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica!=undefined)? `'`+req.body.celular_caracteristica+`'` : `null`;
            
            client.query('BEGIN', (err1, res1) => {
                if(err1){
                    console.log('Ocurrio un error iniciando la transaccion: '+err1.stack);
                }
                client.query(`
                INSERT INTO domicilios(calle, numero, piso, depto
                    , manzana, lote, block, barrio, ciudades_id)
                VALUES(`+ calle + `, `+ numero + `, `+ piso + `, `+ depto + `
                , `+ manzana + `, `+ lote + `, `+ block + `, `+ barrio + `, `+ciudades_id+`)
                RETURNING id;`, (err2, res2) => { 
                    const domicilio = res2.rows[0].id;
                    console.log("Domicilio Insertado con ID:"+res2.rows[0].id); 
                    if(err2) {
                        console.log("Ocurrio un error al guardar el domicilio: "+err2.stack);
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
                                if(err3) {
                                    console.log("Ocurrio un error al guardar la persona: "+err3.stack);
                                    client.query('ROLLBACK');
                                };
                                const persona = res3.rows[0].id;
                                
                                client.query(`
                                    INSERT INTO roma.clientes (fecha_alta, personas_id)
                                    VALUES(now(), `+persona + `) RETURNING *; `, (err4, res4) => { 
                                            if(err4){ 
                                                console.log("Ocurrio un error al guardar el empleado: "+err4.stack);
                                                client.query('ROLLBACK');
                                            }
                                            client.query('COMMIT');       
                                     });

                            });
                });
            })
            res.status(200).send({ "mensaje": "El cliente se cargo exitosamente"});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona"+e.stack});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};
