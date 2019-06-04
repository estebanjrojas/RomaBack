//Conexión a Postgres
const configuracion = require("../utillities/config");
const qEmpleados = require("./query/Empleados.js");
const qDomicilios = require("./query/Domicilios.js");
const qPersonas = require("./query/Personas.js");
var { Pool } = require('pg');
const connectionString = configuracion.bd;


exports.getEmpleadosTodos = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(qEmpleados.getEmpleadosTodos)
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

exports.getEmpleadosBusqueda = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(qEmpleados.getEmpleadosBusqueda, [req.params.texto_busqueda])
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

exports.getEmpleadoPorNroDoc = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(qEmpleados.getEmpleadoPorNroDoc, [req.params.tipo_doc, req.params.nro_doc])
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
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
    
};


exports.getDatosEmpleadoPorId = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(qEmpleados.getDatosEmpleadoPorId, [req.params.id])
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
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
    
    
};

exports.getEmpleadosSinUsuario = function (req, res) {

    try{
        var respuesta = JSON.stringify({"mensaje": "La funcion no responde" });
        var pool = new Pool({
            connectionString: connectionString,
        });
        try{
            (async ()=>{
                respuesta = await pool.query(qEmpleados.getEmpleadosSinUsuario)
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
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
    
    
};

exports.insertEmpleadoReturnId = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {

            let personas_id = (req.body.personas_id!=undefined)? req.body.personas_id : `null`;
            let legajo = (req.body.legajo!=undefined)? req.body.legajo : `null`;
            let fecha_ingreso = (req.body.fecha_ingreso!=undefined)? `'`+req.body.fecha_ingreso+`'` : `now()::date`;
            let descripcion = (req.body.descripcion!=undefined)? `'`+req.body.descripcion+`'` : `null`;
            let empresas_id = (req.body.empresas_id!=undefined)? req.body.empresas_id : `null`;
            let oficina = (req.body.oficina!=undefined)? req.body.oficina : `null`;

            await client.query('BEGIN')
            const { empleado } = await client.query(qEmpleados.insertEmpleadoReturnId, [personas_id, legajo, fecha_ingreso, descripcion, empresas_id, oficina])
        
            await client.query('COMMIT')
            res.status(200).send({ "mensaje": "El empleado se cargo exitosamente", "id": empleado[0].id});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar el empleado"});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};


exports.guardarEmpleadoPersonaDomicilio = function (req, res) {

    var pool = new Pool({
        connectionString: connectionString,
    });

    (async () => {
        const client = await pool.connect()
        try {
            //Parametros para insertar el domicilio
            let calle = (req.body.domicilio.calle!=undefined)? req.body.domicilio.calle : null;
            let numero = (req.body.domicilio.numero!=undefined)? req.body.domicilio.numero : null;
            let piso = (req.body.domicilio.piso!=undefined)?req.body.domicilio.piso : null;
            let depto = (req.body.domicilio.depto!=undefined)? req.body.domicilio.depto : null;
            let manzana = (req.body.domicilio.manzana!=undefined)? req.body.domicilio.manzana : null;
            let lote = (req.body.domicilio.lote!=undefined)? req.body.domicilio.lote : null;
            let block = (req.body.domicilio.block!=undefined)? req.body.domicilio.block : null;
            let barrio = (req.body.domicilio.barrio!=undefined)? req.body.domicilio.barrio : null;
            let ciudades_id = (req.body.domicilio.ciudades_id!=undefined)? req.body.domicilio.ciudades_id : null;
            let domicilios_id = req.body.domicilios_id;
           
            //Parametros para insertar la persona
            let nro_doc = (req.body.nro_doc!=undefined)? req.body.nro_doc : null;
            let tipo_doc = (req.body.tipo_doc!=undefined)? req.body.tipo_doc : null;
            let apellido = (req.body.apellido!=undefined)? req.body.apellido : null;
            let nombre = (req.body.nombre!=undefined)?req.body.nombre : null;
            let telefono = (req.body.telefono!=undefined)? req.body.telefono : null;
            let celular = (req.body.celular!=undefined)? req.body.celular : null;
            let email = (req.body.email!=undefined)? req.body.email : null;
            let fecha_nac = (req.body.fecha_nac!=undefined)? req.body.fecha_nac : null;
            let sexo = (req.body.sexo!=null)? req.body.sexo : null;
            let tipo_persona = (req.body.tipo_persona!=undefined)? req.body.tipo_persona : `1`;
            let ip = `'`+req.ip+`'`;
            let usuario = (req.body.usuario!=undefined)? req.body.usuario : null;
            let estado_civil = (req.body.estado_civil!=undefined)? req.body.estado_civil : null;
            let fecha_cese = (req.body.fecha_cese!=undefined)? req.body.fecha_cese : null;
            let usuario_carga = (req.body.usuario_carga!=undefined)? req.body.usuario_carga : null;
            let ip_carga = req.ip;
            let fecha_carga =  `now()`;
            let telefono_caracteristica = (req.body.telefono_caracteristica!=undefined)? req.body.telefono_caracteristica : null;
            let celular_caracteristica = (req.body.celular_caracteristica!=undefined)? req.body.celular_caracteristica : null;
            let personas_id = req.body.personas_id;
            //Parametros para insertar el empleado
            let legajo = (req.body.legajo!=undefined)? req.body.legajo : null;
            let fecha_ingreso = (req.body.fecha_ingreso!=undefined)? req.body.fecha_ingreso : `now()::date`;
            let descripcion = (req.body.descripcion!=undefined)? req.body.descripcion : null;
            let empresas_id = (req.body.empresas_id!=undefined)? req.body.empresas_id : null;
            let oficina = (req.body.oficina!=undefined)? req.body.oficina : null;
            let empleados_id = req.body.empleados_id;

            let query1;
            if(domicilios_id==undefined || domicilios_id=='null'){
                query1 = {
                    name: 'insert-domicilios',
                    text: qDomicilios.insertDomiciliosReturnId,
                    values: [calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id]
                };
            }
            else {
                query1 = {
                    name: 'update-domicilios',
                    text: qDomicilios.updateDomicilio,
                    values: [calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id, domicilios_id]
                };
            }
            console.log({"query1" : query1.text});
            
            let query2;
            if(personas_id==undefined || personas_id=='null') {
                query2 = {
                    name: 'insert-personas',
                    text: qPersonas.insertPersonaReturningId,
                    values: [nro_doc, tipo_doc, apellido, nombre, telefono, celular, email, fecha_nac, sexo, tipo_persona, ip, usuario, estado_civil, fecha_cese, usuario_carga, ip_carga, fecha_carga, telefono_caracteristica, celular_caracteristica, domicilios_id]
                };
            }
            else {
                query2 = {
                    name: 'update-personas',
                    text: qPersonas.updatePersonas,
                    values: [nro_doc, tipo_doc, apellido, nombre, telefono, celular, email, fecha_nac, sexo, tipo_persona, ip, usuario, estado_civil, fecha_cese, telefono_caracteristica, celular_caracteristica, domicilios_id, personas_id]
                };
             
            }

            console.log({"query2" : query2});

            let query3;
            if(empleados_id==undefined || empleados_id=='null') {
                query3 = {
                    name: 'insert-empleados',
                    text: qEmpleados.insertEmpleadoReturnId,
                    values: [personas_id, legajo, fecha_ingreso, descripcion, empresas_id, oficina]
                };
            } else {
                query3 = {
                    name: 'update-empleados',
                    text: qEmpleados.updateEmpleado,
                    values: [personas_id, legajo, fecha_ingreso, descripcion, empresas_id, oficina, empleados_id]
                };
            }

            console.log({"query3" : query3.text});

            client.query('BEGIN', (err1, res1) => {
                if(err1){
                    console.log('Ocurrio un error iniciando la transaccion: '+err1.stack);
                }
                client.query(query1, (err2, res2) => { 

                    if(query1.name=='insert-domicilio') {domicilios_id = res2.rows[0].id;}

                    if(err2) {
                        console.log("Ocurrio un error al guardar el domicilio: "+err2);
                        client.query('ROLLBACK');
                    };
   
                    client.query(query2, (err3, res3) => { 
                                if(err3) {
                                    console.log("Ocurrio un error al guardar la persona: "+err3);
                                    client.query('ROLLBACK');
                                };
                                if(personas_id==undefined || personas_id=='null') {res3.rows[0].id;}
                                client.query(query3, (err4, res4) => { 
                                            if(err4){ 
                                                console.log("Ocurrio un error al guardar el empleado: "+err4.stack);
                                                client.query('ROLLBACK');
                                            }
                                            client.query('COMMIT');       
                                     });

                            });
                });
            })
            res.status(200).send({ "mensaje": "El empleado se cargo exitosamente"});
        } catch (e) {
            await client.query('ROLLBACK')
            res.status(400).send({ "mensaje": "Ocurrio un error al cargar la persona: "+e.stack});
            throw e
        } finally {
            client.release()
        }
        })().catch(e => console.error(e.stack))
};

