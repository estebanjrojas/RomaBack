//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qProvincias = require('./query/Provincias.js');


exports.getProvinciasPorPais = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
<<<<<<< HEAD
                respuesta = await pool.query(`             
            SELECT * FROM provincias WHERE paises_id =  `+req.params.paises_id)
=======
                respuesta = await pool.query(qProvincias.getProvinciasPorPais, [req.params.paices_id])
>>>>>>> 36b259d4715c52a8daa445585437fb8e68055ba6
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
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }
};
