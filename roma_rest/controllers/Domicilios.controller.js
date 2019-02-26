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
