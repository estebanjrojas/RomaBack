const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;




exports.getVentasTodas = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT 
                      v.id as ventas_id
                    , cli.id as clientes_id
                    , per.id as personas_id
                    , v.fecha
                    , per.nombre as nombre_cliente
                    , per.apellido as apellido_cliente
                    , per2.nombre as nombre_vendedor
                    , per2.apellido as apellido_vendedor
                    , v.monto_total as monto
                FROM roma.ventas v 
                JOIN roma.clientes cli ON v.clientes_id = cli.id
                JOIN personas per ON cli.personas_id = per.id
                JOIN roma.empleados emp ON v.empleados_id = emp.id
                JOIN personas per2 ON emp.personas_id = per2.id `)
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

exports.getVentasBusqueda = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(`             
                SELECT 
                      v.id as ventas_id
                    , cli.id as clientes_id
                    , per.id as personas_id
                    , v.fecha
                    , per.nombre as nombre_cliente
                    , per.apellido as apellido_cliente
                    , per2.nombre as nombre_vendedor
                    , per2.apellido as apellido_vendedor
                    , v.monto_total as monto
                FROM roma.ventas v 
                JOIN roma.clientes cli ON v.clientes_id = cli.id
                JOIN personas per ON cli.personas_id = per.id
                JOIN roma.empleados emp ON v.empleados_id = emp.id
                JOIN personas per2 ON emp.personas_id = per2.id
                    WHERE (per.nombre::varchar ilike '%`+ req.params.texto_busqueda + `%'
                            OR per.apellido::varchar ilike '%`+ req.params.texto_busqueda + `%'
                            OR per2.nombre::varchar ilike '%`+ req.params.texto_busqueda + `%'
                            OR per2.apellido::varchar ilike '%`+ req.params.texto_busqueda + `%'
                            OR v.monto_total::varchar ilike '%`+ req.params.texto_busqueda + `%')`
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



exports.insertVentaReturningFactura = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            var  ventas_id  = -1;
            //Parametros para insertar la venta
            const clientes_id = req.body.cliente.clientes_id;
            const empleados_id = req.body.vendedor.empleados_id;
            const empresas_id = req.body.vendedor.empresas_id;
            const monto_total = req.body.monto_total;

            //Parametros para insertar los detalles de la venta
            const detalles = req.body.detalles;
            
            client.query('BEGIN', (err_transaccion, res_transaccion) => {
                if(err_transaccion){
                    console.log('Ocurrio un error iniciando la transaccion: '+err_transaccion.stack);
                }
                //Inicio la Venta
                client.query(`
                INSERT INTO roma.ventas(fecha, monto_total, empresas_id, empleados_id, clientes_id)
                VALUES(now()::date, ${monto_total}, ${empresas_id}, ${empleados_id}, ${clientes_id})
                RETURNING id;`, (err_vta, res_vta)=>{
                    if(err_vta){
                        console.log('Ocurrio un error cargar la venta: '+err_vta.stack);
                    }
                    ventas_id  = res_vta.rows[0].id;
                    console.log({"ventas":ventas_id});
                    for(let i=0; i<detalles.length; i++){
                        client.query(`
                        INSERT INTO roma.ventas_detalle(cantidad, monto, descuento, subtotal, ventas_id, productos_id)
                        VALUES(${detalles[i].cantidad}, ${detalles[i].producto.precio_actual}, ${detalles[i].descuento}, ${detalles[i].subtotal}, ${ventas_id}, ${detalles[i].producto.productos_id})
                        RETURNING id;`, (err_dvta, res_dvta)=>{
                            if(err_dvta){
                                console.log('Ocurrio un error cargar el detalle de la venta: '+err_dvta.stack);
                            }
                        });
  
                    }


                });

            });

            

            /*

            const { facturas_id } = await client.query(`
            SELECT roma.facturar_venta(${ventas_id}); `);*/
        
            await client.query('COMMIT;')
            res.status(200).send({ "mensaje": "La venta se cargo exitosamente", "insertado": ventas_id});
        } catch (e) {
            await client.query('ROLLBACK;')
            res.status(400).send({ "mensaje": `Ocurrio un error al cargar la venta: ${e}`});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};