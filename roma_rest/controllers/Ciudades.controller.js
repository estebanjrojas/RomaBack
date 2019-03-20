


//Conexión a Postgres
const configuracion = require("../utillities/config");
const querystring = require('querystring');
var { Pool } = require('pg');
const connectionString = configuracion.bd;

exports.getCiudadesPorProvincia = function (req, res) {
    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`             
            SELECT * FROM ciudades WHERE provincias_id =  `+req.params.provincias_id)
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



exports.getCiudadesIdPorNombre = function (req, res) {
    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                let nombre_ciudad = querystring.unescape(req.params.nombre);
                respuesta = await pool.query(`             
                SELECT id FROM ciudades WHERE nombre ILIKE  '%`+nombre_ciudad+`%' LIMIT 1;`)
                .then(resp => {
                    console.log(JSON.stringify(resp.rows));
                    res.status(200).send({"id": resp.rows[0].id});
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