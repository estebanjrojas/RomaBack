const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const qVentas = require("./query/Ventas.js");



exports.getVentasTodas = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getVentasTodas)
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
                respuesta = await pool.query(qVentas.getVentasBusqueda, [req.params.texto_busqueda])
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

exports.getVentaPorId = function (req, res) {

    try {
        var respuesta = JSON.stringify({ "mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            (async () => {
                respuesta = await pool.query(qVentas.getVentaPorId, [req.params.ventas_id])
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
                client.query(qVentas.insertReturnId, [monto_total, empresas_id, empleados_id, clientes_id], (err_vta, res_vta)=>{
                    if(err_vta){
                        console.log('Ocurrio un error cargar la venta: '+err_vta.stack);
                    }
                    ventas_id  = res_vta.rows[0].id;
                    console.log({"ventas":ventas_id});
                    for(let i=0; i<detalles.length; i++){
                        client.query(qVentas.insertDetalleReturnId, [detalles[i].cantidad, detalles[i].producto.precio_actual, detalles[i].descuento, detalles[i].subtotal, ventas_id, detalles[i].producto.productos_id], (err_dvta, res_dvta)=>{
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


exports.anularVenta = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            let ventas_id = (req.body.ventas_id != undefined) ? req.body.ventas_id : `null`;
            let usuario = (req.body.usuario != undefined) ? req.body.usuario : `null`;
        
            await client.query('BEGIN');
            await client.query(qVentas.anularVenta, [usuario, ventas_id])
            await client.query('COMMIT');
            res.status(200).send({ "mensaje": "La venta se anulo exitosamente"});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al anular la venta" });
            throw e
        } finally {
            client.release()
        }
    })().catch(e => console.error(e.stack))
};