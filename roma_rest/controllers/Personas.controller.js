//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;


exports.insertPersonaReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

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
            let usuario = (req.body.usuario!=undefined)? `'`+req.body.usuario+`'` : `null`;
            let estado_civil = (req.body.estado_civil!=undefined)? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese!=undefined)? `'`+req.body.fecha_cese+`'` : `null`;
            let usuario_carga = (req.body.usuario_carga!=undefined)? `'`+req.body.usuario_carga+`'` : `null`;
            let fecha_carga = (req.body.fecha_carga!=undefined)? `'`+req.body.fecha_carga+`'` : `null`;
            let telefono_caracteristica = (req.body.telefono_caracteristica!=undefined)? `'`+req.body.telefono_caracteristica+`'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica!=undefined)? `'`+req.body.celular_caracteristica+`'` : `null`;
            let domicilios_id = (req.body.domicilios_id!=undefined)? `'`+req.body.domicilios_id+`'` : `null`;


            await client.query('BEGIN')
            const { persona } = await client.query(`
            INSERT INTO personas(nro_doc, tipo_doc
                , apellido, nombre
                , telefono, telefono_cel, email
                , fecha_nac, sexo, tipo_persona
                , fecha_create, usuario, fecha_mov
                , estado_civil
                , fecha_cese, usuario_carga, fecha_carga
                , telefono_caracteristica, celular_caracteristica
                , domicilios_id)
            VALUES(`+ nro_doc + `, `+ tipo_doc + `
                , `+ apellido + `, `+ nombre + `
                , `+ telefono + `, `+ celular + `, `+ email + `
                , `+ fecha_nac + `, `+ sexo + `, `+ tipo_persona + `
                , now(), `+ usuario + `, now()
                , `+ estado_civil + `
                , `+ fecha_cese + `, `+ usuario_carga + `, `+ fecha_carga + `
                , `+ telefono_caracteristica + `, `+ celular_caracteristica + `
                , `+ domicilios_id + `
                ) RETURNING id; `)

            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "La persona se cargo exitosamente", "id":persona[0].id});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona"});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};


exports.insertPersonaDomicilio = function (req, res) {

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
            let usuario = (req.body.usuario!=undefined)? `'`+req.body.usuario+`'` : `null`;
            let estado_civil = (req.body.estado_civil!=undefined)? req.body.estado_civil : `null`;
            let fecha_cese = (req.body.fecha_cese!=undefined)? `'`+req.body.fecha_cese+`'` : `null`;
            let usuario_carga = (req.body.usuario_carga!=undefined)? `'`+req.body.usuario_carga+`'` : `null`;
            let telefono_caracteristica = (req.body.telefono_caracteristica!=undefined)? `'`+req.body.telefono_caracteristica+`'` : `null`;
            let celular_caracteristica = (req.body.celular_caracteristica!=undefined)? `'`+req.body.celular_caracteristica+`'` : `null`;

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
                , fecha_create, usuario, fecha_mov
                , estado_civil
                , fecha_cese, usuario_carga
                , telefono_caracteristica, celular_caracteristica
                , domicilios_id)
            VALUES(`+ nro_doc + `, `+ tipo_doc + `
                , `+ apellido + `, `+ nombre + `
                , `+ telefono + `, `+ celular + `, `+ email + `
                , `+ fecha_nac + `, `+ sexo + `, `+ tipo_persona + `
                , now(), `+ usuario + `, now()
                , `+ estado_civil + `
                , `+ fecha_cese + `, `+ usuario_carga + `
                , `+ telefono_caracteristica + `, `+ celular_caracteristica + `
                , `+ domicilio[0].id + `
                ) RETURNING id; `)
        
            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "La persona se cargo exitosamente", "id":persona[0].id});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona"});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};

exports.getPersonaPorNroDoc = function (req, res) {
    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`
                SELECT *
                FROM personas
                WHERE tipo_doc = `+req.params.tipo_doc+` AND nro_doc = `+req.params.nro_doc)
                .then(resp => {
                 //   console.log(JSON.stringify(resp.rows));
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

