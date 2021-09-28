//Conexión a Postgres
const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
const qUsuarios = require("./query/Usuarios.js");
const poolSrv = require("../services/PoolService");
const querySrv = require("../services/QueryService");

async function generarTokenString(usuario, identificador) {
    try {
        const pool = poolSrv.getInstance().getPool();
        pool.connect((err, client, release) => {
            if (err) {
                res.status(400).send(JSON.stringify({ "mensaje": `Pool Error ${err}` }));
            } else {
                var token_generado = '';
                client.query(qUsuarios.generarTokenString, [usuario, identificador], (err, resp) => {
                    release();
                    if (err) {
                        res.status(400).send(JSON.stringify({ "mensaje": "Query Error" }));
                        return;
                    }
                    token_generado = resp.rows[0].token_acceso;
                    return token_generado;
                });
            }
        })
    } catch (err) {
        res.status(400).send({ 'error': `${err}` });
    }

}

function generarToken(usuario, token_bd, llave_privada) {
    try {
        let token = jwt.sign({ "token": token_bd }, llave_privada, {
            subject: usuario,
            expiresIn: 60 * 60 * 24 // expira en 24 horas
        })
        return token;
    } catch (err) {
        throw err;
    }
}

/*---------------------------GET----------------------------- */

exports.solicitarAccesoUsuario = function (req, res) {
    try {
        const pool = poolSrv.getInstance().getPool();
        pool.connect((err, client, release) => {
            if (err) {
                res.status(400).send(JSON.stringify({ "mensaje": `Pool Error ${err}` }));
            } else {
                client.query(qUsuarios.solicitarAccesoUsuario, [req.params.pswrd, req.params.nomb_usr], (err, resp) => {
                    release();
                    if (resp.rows[0].permitir_acceso) {
                        let token_generado = generarTokenString(req.params.nomb_usr, req.params.pswrd).then(
                            function () {
                                res.status(200).send(JSON.stringify({ respuesta: generarToken(req.params.nomb_usr, token_generado, configuracion.llave) }));
                            }
                        ).catch(function () {
                            res.status(400).send(JSON.stringify({ "error": "Error al generar el token" }));
                        })
            
                    } else {
                        res.send(JSON.stringify({ "error": "Usuario y/o contraseña incorrectos" }));  
                    }
                    
                    if (err) {
                        res.status(400).send(JSON.stringify({ "mensaje": "Ocurrio un ERROR al validar el usuario" }));
                        return;
                    }
                   
                });
            }
        })
    } catch (err) {
        res.status(400).send({ 'error': `${err}` });
    }
}

exports.validarPassVieja = async function (req, res) {
    try {
        const pool = poolSrv.getInstance().getPool();
        pool.connect((err, client, release) => {
            if (err) {
                res.status(400).send(JSON.stringify({ "mensaje": `Pool Error ${err}` }));
            } else {
                client.query(qUsuarios.solicitarAccesoUsuario, [req.params.pswrd, req.params.nomb_usr], (err, resp) => {
                    release();
                    if (err) {
                        res.status(400).send(JSON.stringify({ "mensaje": "El password ingresado no es correcto" }));
                        return;
                    }
                    res.status(200).send({ "mensaje": "El password ingresado es correcto", "permitir_acceso": resp[0].permitir_acceso });
                });
            }
        })
    } catch (err) {
        res.status(400).send({ 'error': `${err}` });
    }  
}


exports.cambiarPassword = function (req, res) {
    querySrv.getQueryResults(qUsuarios.cambiarPassword, [req.body.password, req.body.usuario])
    .then(response => res.send({ "mensaje": "El password fue actualizado exitosamente", "id": response.value[0].id }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getDatosUsuario = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getDatosUsuario, [req.params.usuario])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getUsuariosTodos = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getUsuariosTodos, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getUsuariosBusqueda = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getUsuariosBusqueda, [req.params.texto_busqueda])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}


exports.getDatosUsuariosCargados = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getDatosUsuariosCargados, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getPerfilesAsignados = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getPerfilesAsignados, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getPerfilesSinAsignar = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getPerfilesSinAsignar, [req.params.id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
   
}



//-----------> PAGINACION INICIO :
exports.getCantidadPaginasUsuarios = function (req, res) {
    querySrv.getQueryResults(qUsuarios.getCantidadPaginasUsuarios, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getCantidadPaginasUsuariosTxt = function (req, res) {
    //Preparacion de los parametros para la consulta
    let parametrosBusqueda = ``;
    let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    let habilitarBusquedaUsuario = parseInt(req.params.busca_usuario);
    let habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    if ((habilitarBusquedaNombre + habilitarBusquedaUsuario + habilitarBusquedaDescripcion) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
        if (habilitarBusquedaNombre == 1) {
            parametrosBusqueda = parametrosBusqueda + `ps.apellido::varchar ||', '|| ps.nombre::varchar ilike '%` + req.params.txt + `%'`;
        }
        if (habilitarBusquedaUsuario == 1) {
            if (habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `usr.nomb_usr::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR usr.nomb_usr::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
        if (habilitarBusquedaDescripcion == 1) {
            if ((habilitarBusquedaNombre + habilitarBusquedaUsuario) == 0) {
                parametrosBusqueda = parametrosBusqueda + `usr.desc_usr::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR usr.desc_usr::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
    }
    //Consulta
    const query = ` 
    SELECT 
        count(*) as cantidad_registros,
        (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
    FROM (
        SELECT 
            * 
        FROM seguridad.usuarios usr
        JOIN public.personas ps ON usr.personas_id = ps.id 
        ${parametrosBusqueda}
    )x `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send({ "regCantidadPaginas": response.value[0] }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}

exports.getUsuarios = function (req, res) {
    const query = ` 
    SELECT 
        * 
    FROM seguridad.usuarios usr
    JOIN public.personas ps ON usr.personas_id = ps.id 
    ORDER BY ps.apellido, ps.nombre
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas} 
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END) -1))
    LIMIT 5 `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));

}

exports.getUsuariosTxt = function (req, res) {
    //Preparacion de los parametros de la consulta
    let parametrosBusqueda = ``;
    let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
    let habilitarBusquedaUsuario = parseInt(req.params.busca_usuario);
    let habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
    if ((habilitarBusquedaNombre + habilitarBusquedaUsuario + habilitarBusquedaDescripcion) > 0) {
        parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
        if (habilitarBusquedaNombre == 1) {
            parametrosBusqueda = parametrosBusqueda + `ps.apellido::varchar ||', '|| ps.nombre::varchar ilike '%` + req.params.txt + `%'`;
        }
        if (habilitarBusquedaUsuario == 1) {
            if (habilitarBusquedaNombre == 0) {
                parametrosBusqueda = parametrosBusqueda + `usr.nomb_usr::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR usr.nomb_usr::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
        if (habilitarBusquedaDescripcion == 1) {
            if ((habilitarBusquedaNombre + habilitarBusquedaUsuario) == 0) {
                parametrosBusqueda = parametrosBusqueda + `usr.desc_usr::varchar ilike '%` + req.params.txt + `%'`;
            } else {
                parametrosBusqueda = parametrosBusqueda + `OR usr.desc_usr::varchar ilike '%` + req.params.txt + `%'`;
            }
        }
    }
    //Consulta
    const query = ` 
    SELECT 
        * 
    FROM seguridad.usuarios usr
    JOIN public.personas ps ON usr.personas_id = ps.id 
    ${parametrosBusqueda}
    ORDER BY ps.apellido, ps.nombre
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;

    querySrv.getQueryResults(query, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}
//<------------------PAGINACION FIN



/*---------------------------POST----------------------------- */

exports.insertUsuarioReturnId = function (req, res) {
    let debug = 0;
    const personas_id = (req.body.personas_id != undefined) ? req.body.personas_id : `null`;
    const nomb_usr = (req.body.nombre_usuario != undefined) ? req.body.nombre_usuario  : `null`;
    const usuario = (req.body.usuario != undefined) ? req.body.usuario : `null`;
    const check_debug = (req.body.chk_debug != undefined) ? req.body.chk_debug : `null`;

    if (check_debug) {
        debug = 1;
    } else {
        debug = 0;
    }

    querySrv.getQueryResults(qUsuarios.insertUsuarioReturnId, [nomb_usr, usuario, debug, personas_id])
    .then(response => res.send({ "mensaje": "El USUARIO fue guardado exitosamente", "id": response.value[0].id }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}


exports.insertPerfilesAsignados = function (req, res) {
    const usuarios_id = (req.body.usuarios_id != undefined) ? req.body.usuarios_id : `null`;
    const perfiles_id = (req.body.perfiles_id != undefined) ? req.body.perfiles_id : `null`;

    querySrv.getQueryResults(qUsuarios.insertPerfilesAsignados, [usuarios_id, perfiles_id])
    .then(response => res.send({ "mensaje": "El Perfil fue guardado exitosamente", "id": response.value[0].id }))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}


exports.actualizarDatosUsuarios = function (req, res) {
    res.status(400).send("Este metodo no tiene consulta...");
}

/*---------------------------DELETE----------------------------- */


exports.deletePerfiles = function (req, res) {
    querySrv.getQueryResults(qUsuarios.deletePerfiles, [req.params.id_usuario])
    .then(response => res.send({ "mensaje": "El Perfil fue eliminado exitosamente"}))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}





