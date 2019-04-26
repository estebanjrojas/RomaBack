const configuracion = require("../utillities/config");
var { Pool } = require('pg');
const connectionString = configuracion.bd;


exports.obtenerJSONTodasCategorias = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(`SELECT roma.armar_json_completo_categorias() as categorias;`
            )
                .then(resp => {
                    console.log(resp.rows[0]);
                    res.status(200).send(resp.rows[0]);
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


exports.getCategoriasTodas = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT *, roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
                FROM roma.categorias  `)
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

exports.getCategoriasBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
            SELECT *, roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
            FROM roma.categorias 
            WHERE (nombre::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR descripcion::varchar ilike '%`+ req.params.texto_busqueda + `%'
                    OR categorias_id_padre::varchar ilike '%`+ req.params.texto_busqueda + `%')`
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
