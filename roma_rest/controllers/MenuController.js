const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qMenu = require("./query/Menu.js");



exports.getMenuUsuario = async function (req, res) {
    try {
    
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });

        respuesta = await pool.query(qMenu.getMenu, [req.params.nomb_usr] )
            .then(resp => {
                console.log(JSON.stringify(resp.rows));
                res.status(200).send({ "menu": resp.rows[0].menu });
            }).catch(err => {
                
                console.error("ERROR", err);
                res.status(400).send(JSON.stringify({ "mensaje": "Sin resultados de la consulta" }));
            });
        return respuesta;
    } catch (error) {
        res.status(400).send(JSON.stringify({ "mensaje": error.stack }));
    }
};
