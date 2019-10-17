//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;



exports.getDomicilioByNroDoc = function (req, res) {
    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`             
                SELECT * 
                FROM personas prs
                JOIN domicilios dom on prs.domicilios_id = dom.id
                JOIN ciudades ciu on dom.ciudades_id = ciu.id
                WHERE prs.nro_doc =   `+req.params.nro_doc)
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
        res.status(400).send({'mensaje': 'Ocurrio un Error'});
    }
    
};



exports.getCalles = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {

                let query = `SELECT *
                FROM calles
                WHERE nombre ilike '%`+req.params.calles_nombre+`%' 
                ORDER BY nombre
                LIMIT 5`;
                console.log(query);
                //respuesta = await pool.query(qDomicilios.getCalles, [req.params.calles_nombre])
                respuesta = await pool.query(query)
                    .then(resp => {
                        console.log('erroreee');
                        console.log(JSON.stringify(resp.rows));
                        res.status(200).send(JSON.stringify(resp.rows));
                    }).catch(err => {
                        console.log('erroreee2');
                        console.error("ERROR", err.stack);
                        res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta", err }));
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


exports.getCallesEmpty = function (req, res) {
    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        try {
            (async () => {

                let query = `SELECT *
                FROM calles
                ORDER BY nombre
                LIMIT 5`;
                console.log(query);
                //respuesta = await pool.query(qDomicilios.getCalles, [req.params.calles_nombre])
                respuesta = await pool.query(query)
                    .then(resp => {
                        console.log('erroreee');
                        console.log(JSON.stringify(resp.rows));
                        res.status(200).send(JSON.stringify(resp.rows));
                    }).catch(err => {
                        console.log('erroreee2');
                        console.error("ERROR", err.stack);
                        res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta", err }));
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


exports.insert = function (req, res) {
    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`             
                INSERT INTO domicilios(calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id)
                VALUES ('`+req.body.calle+`', '`+req.body.numero+`', '`+req.body.lote+`', '`+req.body.bloc+`', '`+req.body.barrio+`', `+req.body.ciudades_id+`)
                RETURNING id;`)
                .then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send({"domicilios_id" : resp.rows[0].id});
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
        res.status(400).send({'mensaje': 'Ocurrio un Error'});
    }
};
