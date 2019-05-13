const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;



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