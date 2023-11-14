const qEmpleados = require("./query/Empleados.js");
const qDomicilios = require("./query/Domicilios.js");
const qPersonas = require("./query/Personas.js");
const qCiudades = require("./query/Ciudades.js");
const querySrv = require("../services/QueryService");
var { Pool } = require("pg");
const configuracion = require("../utillities/config");
const connectionString = configuracion.bd;

/* ---------------------------GET---------------------------- */

exports.getEmpleadosTodos = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getEmpleadosTodos, [])
    .then((response) => res.send(response.value))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getEmpleadosBusqueda = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getEmpleadosBusqueda, [
      req.params.texto_busqueda,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getEmpleadoPorNroDoc = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getEmpleadoPorNroDoc, [
      req.params.tipo_doc,
      req.params.nro_doc,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getDatosEmpleadoPorId = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getDatosEmpleadoPorId, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getEmpleadosSinUsuario = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getEmpleadosSinUsuario, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getOficinas = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getOficinas, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

//-----------> PAGINACION INICIO :
exports.getCantidadPaginasEmpleados = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getCantidadPaginasEmpleados, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getCantidadPaginasEmpleadosTxt = function (req, res) {
  let parametrosBusqueda = ``;
  const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  const habilitarBusquedaDocumento = parseInt(req.params.busca_documento);
  const habilitarBusquedaFechaNac = parseInt(req.params.busca_fechanac);
  const habilitarBusquedaOficina = parseInt(req.params.busca_oficina);
  if (
    habilitarBusquedaNombre +
    habilitarBusquedaDocumento +
    habilitarBusquedaFechaNac +
    habilitarBusquedaOficina >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
    if (habilitarBusquedaNombre == 1) {
      parametrosBusqueda =
        parametrosBusqueda +
        ` ps.apellido::varchar ||', '|| ps.nombre::varchar ilike '%${req.params.txt}%'`;
    }
    if (habilitarBusquedaDocumento == 1) {
      if (habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          ` ps.nro_doc::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          ` OR ps.nro_doc::varchar ilike '%${req.params.txt}%'`;
      }
    }
    if (habilitarBusquedaFechaNac == 1) {
      if (habilitarBusquedaNombre + habilitarBusquedaDocumento == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          ` ps.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          ` OR ps.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      }
    }
    if (habilitarBusquedaOficina == 1) {
      if (
        habilitarBusquedaNombre +
        habilitarBusquedaDocumento +
        habilitarBusquedaFechaNac ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          ` of.descripcion::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          ` OR of.descripcion::varchar ilike '%${req.params.txt}%'`;
      }
    }
  }

  const query = ` 
    SELECT 
        count(*) as cantidad_registros,
        (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
    FROM (
        SELECT 
            em.id as empleados_id
            , em.personas_id
            , em.legajo
            , em.fecha_ingreso
            , em.descripcion
            , of.descripcion as oficina
            , ep.id as empresas_id
            , ep.razon_social as empresa_razon_social
            , ep.nombre_fantasia as empresa_nombre_fantasia
            , ps.*
        FROM roma.empleados em
        JOIN personas ps ON em.personas_id = ps.id
        JOIN roma.empresas ep ON em.empresas_id = ep.id
        JOIN roma.oficinas of ON em.oficina = of.id
        ${parametrosBusqueda} AND em.fecha_egreso is null
    )x `;


  console.log({ 'parametros': parametrosBusqueda });

  querySrv
    .getQueryResults(query, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getEmpleados = function (req, res) {
  querySrv
    .getQueryResults(qEmpleados.getEmpleados, [
      req.params.paginaActual,
      req.params.cantidadPaginas,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getEmpleadosTxt = function (req, res) {
  let parametrosBusqueda = ``;
  const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  const habilitarBusquedaDocumento = parseInt(req.params.busca_documento);
  const habilitarBusquedaFechaNac = parseInt(req.params.busca_fechanac);
  const habilitarBusquedaOficina = parseInt(req.params.busca_oficina);
  if (
    habilitarBusquedaNombre +
    habilitarBusquedaDocumento +
    habilitarBusquedaFechaNac +
    habilitarBusquedaOficina >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE   `;
    if (habilitarBusquedaNombre == 1) {
      parametrosBusqueda =
        parametrosBusqueda +
        `ps.apellido::varchar ||', '|| ps.nombre::varchar ilike '%${req.params.txt}%'`;
    }
    if (habilitarBusquedaDocumento == 1) {
      if (habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `ps.nro_doc::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR ps.nro_doc::varchar ilike '%${req.params.txt}%'`;
      }
    }
    if (habilitarBusquedaFechaNac == 1) {
      if (habilitarBusquedaNombre + habilitarBusquedaDocumento == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `ps.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR ps.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      }
    }
    if (habilitarBusquedaOficina == 1) {
      if (
        habilitarBusquedaNombre +
        habilitarBusquedaDocumento +
        habilitarBusquedaFechaNac ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          `of.descripcion::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR of.descripcion::varchar ilike '%${req.params.txt}%'`;
      }
    }
  }

  const query = ` 
    SELECT 
        em.id as empleados_id
        , em.personas_id
        , em.legajo
        , em.fecha_ingreso
        , em.descripcion
        , of.descripcion as oficina
        , ep.id as empresas_id
        , ep.razon_social as empresa_razon_social
        , ep.nombre_fantasia as empresa_nombre_fantasia
        , ps.*
    FROM roma.empleados em
    JOIN personas ps ON em.personas_id = ps.id
    JOIN roma.empresas ep ON em.empresas_id = ep.id
    JOIN roma.oficinas of ON em.oficina = of.id
    ${parametrosBusqueda} AND em.fecha_egreso is null
    ORDER BY ps.apellido, ps.nombre
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;

  querySrv
    .getQueryResults(query, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};
//<------------------PAGINACION FIN

/* ---------------------------POST---------------------------- */

exports.insertEmpleadoReturnId = function (req, res) {
  const personas_id =
    req.body.personas_id != undefined ? req.body.personas_id : `null`;
  const legajo = req.body.legajo != undefined ? req.body.legajo : `null`;
  const fecha_ingreso =
    req.body.fecha_ingreso != undefined
      ? `'` + req.body.fecha_ingreso + `'`
      : `now()::date`;
  const descripcion =
    req.body.descripcion != undefined
      ? `'` + req.body.descripcion + `'`
      : `null`;
  const empresas_id =
    req.body.empresas_id != undefined ? req.body.empresas_id : `null`;
  const oficina = req.body.oficina != undefined ? req.body.oficina : `null`;

  querySrv
    .getQueryResults(qEmpleados.insertEmpleadoReturnId, [
      personas_id,
      legajo,
      fecha_ingreso,
      descripcion,
      empresas_id,
      oficina,
    ])
    .then((response) =>
      res.send({
        mensaje: "El empleado se cargo exitosamente",
        id: response.value[0].id,
      })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.guardarEmpleadoPersonaDomicilio = function (req, res) {
  //Parametros para insertar el domicilio
  let calle = req.body.calle != undefined ? req.body.calle : null;
  let numero = req.body.numero != undefined ? req.body.numero : null;
  let piso = req.body.piso != undefined ? req.body.piso : null;
  let depto = req.body.depto != undefined ? req.body.depto : null;
  let manzana = req.body.manzana != undefined ? req.body.manzana : null;
  let lote = req.body.lote != undefined ? req.body.lote : null;
  let block = req.body.block != undefined ? req.body.block : null;
  let barrio = req.body.barrio != undefined ? req.body.barrio : null;
  let ciudades_id =
    req.body.ciudades_id != undefined ? req.body.ciudades_id : null;
  let domicilios_id =
    req.body.domicilios_id != undefined || req.body.domicilios_id != ""
      ? req.body.domicilios_id
      : null;

  //Parametros para insertar la persona
  let nro_doc = req.body.documento != undefined ? req.body.documento : null;
  let tipo_doc = req.body.tipo_doc != undefined ? req.body.tipo_doc : null;
  let apellido = req.body.apellido != undefined ? req.body.apellido : null;
  let nombre = req.body.nombre != undefined ? req.body.nombre : null;
  let telefono = req.body.telefono != undefined ? req.body.telefono : null;
  let celular = req.body.celular != undefined ? req.body.celular : null;
  let email = req.body.email != undefined ? req.body.email : null;
  let fecha_nac = req.body.fecha_nac != undefined ? req.body.fecha_nac : null;
  let genero = req.body.genero != null ? req.body.genero : "N";
  let tipo_persona =
    req.body.tipo_persona != undefined ? req.body.tipo_persona : `1`;
  let ip = `'` + req.ip + `'`;
  let usuario = req.body.usuario != undefined ? req.body.usuario : null;
  let fecha_cese =
    req.body.fecha_cese != undefined ? req.body.fecha_cese : null;
  let usuario_carga =
    req.body.usuario_carga != undefined ? req.body.usuario_carga : null;

  let telefono_caracteristica =
    req.body.telefono_caracteristica != undefined
      ? req.body.telefono_caracteristica
      : null;
  let celular_caracteristica =
    req.body.celular_caracteristica != undefined
      ? req.body.celular_caracteristica
      : null;
  let personas_id =
    req.body.personas_id != undefined || req.body.personas_id != ""
      ? req.body.personas_id
      : null;
  //Parametros para insertar el empleado
  let legajo = req.body.legajo != undefined ? req.body.legajo : null;
  let fecha_ingreso =
    req.body.fecha_ingreso != undefined
      ? req.body.fecha_ingreso
      : `now()::date`;
  let descripcion =
    req.body.descripcion != undefined ? req.body.descripcion : null;
  let empresas_id =
    req.body.empresas_id != undefined ? req.body.empresas_id : null;
  let oficina = req.body.oficina != undefined ? req.body.oficina : null;
  let empleados_id =
    req.body.empleados_id != undefined || req.body.empleados_id != ""
      ? req.body.empleados_id
      : null;

  let queryDomicilio;
  if (domicilios_id == undefined || domicilios_id == "null") {
    queryDomicilio = {
      name: "insert-domicilios",
      text: qDomicilios.insertDomiciliosReturnIdFull,
      values: [
        calle,
        numero,
        piso,
        depto,
        manzana,
        lote,
        block,
        barrio,
        ciudades_id,
      ],
    };
  } else {
    queryDomicilio = {
      name: "update-domicilios",
      text: qDomicilios.updateDomicilio,
      values: [
        calle,
        numero,
        piso,
        depto,
        manzana,
        lote,
        block,
        barrio,
        ciudades_id,
        domicilios_id,
      ],
    };
  }

  querySrv
    .getQueryResults(queryDomicilio.text, queryDomicilio.values)
    .then((domiciliosResp) => {
      if (queryDomicilio.name == "insert-domicilio") {
        domicilios_id = domiciliosResp.value[0].id;
      }
      let queryPersona;
      if (personas_id == undefined || personas_id == "null") {
        queryPersona = {
          name: "insert-personas",
          text: qPersonas.insertReturingId,
          values: [
            nro_doc,
            tipo_doc,
            apellido,
            nombre,
            telefono,
            celular,
            email,
            fecha_nac,
            genero,
            tipo_persona,
            usuario,
            fecha_cese,
            usuario_carga,
            telefono_caracteristica,
            celular_caracteristica,
            domicilios_id,
          ],
        };
      } else {
        queryPersona = {
          name: "update-personas",
          text: qPersonas.updatePersonas,
          values: [
            nro_doc,
            tipo_doc,
            apellido,
            nombre,
            telefono,
            celular,
            email,
            fecha_nac,
            genero,
            tipo_persona,
            ip,
            usuario,
            fecha_cese,
            telefono_caracteristica,
            celular_caracteristica,
            domicilios_id,
            personas_id,
          ],
        };
      }
      querySrv
        .getQueryResults(queryPersona.text, queryPersona.values)
        .then((personaResp) => {
          if (personas_id == undefined || personas_id == "null") {
            personas_id = personaResp.value[0].id;
          }
          let queryEmpleado;
          if (empleados_id == undefined || empleados_id == "null") {
            queryEmpleado = {
              name: "insert-empleados",
              text: qEmpleados.insertEmpleadoReturnId,
              values: [
                personas_id,
                legajo,
                fecha_ingreso,
                descripcion,
                empresas_id,
                oficina,
              ],
            };
          } else {
            queryEmpleado = {
              name: "update-empleados",
              text: qEmpleados.updateEmpleado,
              values: [
                personas_id,
                legajo,
                fecha_ingreso,
                descripcion,
                empresas_id,
                oficina,
                empleados_id,
              ],
            };
          }
          querySrv
            .getQueryResults(queryEmpleado.text, queryEmpleado.values)
            .then((empleadoResp) =>
              res.send({
                mensaje: "El empleado se cargo exitosamente",
                id: empleadoResp.value[0].id,
              })
            )
            .catch((err) =>
              res
                .status(400)
                .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
            );
        })
        .catch((err) =>
          res.status(400).send(
            JSON.stringify({
              mensaje: `Ha ocurrido error al cargar la persona ${err}`,
            })
          )
        );
    })
    .catch((err) =>
      res.status(400).send(
        JSON.stringify({
          mensaje: `Ha ocurrido error al cargar el domicilio ${err}`,
        })
      )
    );
};

exports.insertEmpleado = function (req, res) {

  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  console.log({ 'body': body });

  //Parametros para insertar el domicilio
  let calle = body.formulario.calle != undefined ? body.formulario.calle : null;
  let numero = body.formulario.numero != undefined ? body.formulario.numero : null;
  let piso = body.formulario.piso != undefined ? body.formulario.piso : null;
  let depto = body.formulario.depto != undefined ? body.formulario.depto : null;
  let manzana = body.formulario.manzana != undefined ? body.formulario.manzana : null;
  let lote = body.formulario.lote != undefined ? body.formulario.lote : null;
  let block = body.formulario.block != undefined ? body.formulario.block : null;
  let barrio = body.formulario.barrio != undefined ? body.formulario.barrio : null;
  let ciudades_id =
    body.formulario.ciudades_id != undefined ? body.formulario.ciudades_id : null;
  let domicilios_id =
    body.formulario.domicilios_id != undefined || body.formulario.domicilios_id != ""
      ? body.formulario.domicilios_id
      : null;

  //Parametros para insertar la persona
  let nro_doc = body.formulario.documento != undefined ? body.formulario.documento : null;
  let tipo_doc = body.formulario.tipo_doc != undefined ? body.formulario.tipo_doc : null;
  let apellido = body.formulario.apellido != undefined ? body.formulario.apellido : null;
  let nombre = body.formulario.nombre != undefined ? body.formulario.nombre : null;
  let telefono = body.formulario.telefono != undefined ? body.formulario.telefono : null;
  let celular = body.formulario.celular != undefined ? body.formulario.celular : null;
  let email = body.formulario.email != undefined ? body.formulario.email : null;
  let fecha_nac = body.formulario.fecha_nac != undefined ? body.formulario.fecha_nac : null;
  let genero = body.formulario.sexo != null ? body.formulario.sexo : "N";
  let tipo_persona =
    body.formulario.tipo_persona != undefined ? body.formulario.tipo_persona : `1`;
  let ip = `'` + req.ip + `'`;
  let usuario = body.formulario.usuario != undefined ? body.formulario.usuario : null;
  let fecha_cese =
    body.formulario.fecha_cese != undefined ? body.formulario.fecha_cese : null;
  let usuario_carga =
    body.formulario.usuario_carga != undefined ? body.formulario.usuario_carga : null;

  let telefono_caracteristica =
    body.formulario.telefono_caracteristica != undefined
      ? body.formulario.telefono_caracteristica
      : null;
  let celular_caracteristica =
    body.formulario.celular_caracteristica != undefined
      ? body.formulario.celular_caracteristica
      : null;
  let personas_id =
    body.formulario.personas_id != undefined || body.formulario.personas_id != ""
      ? body.formulario.personas_id
      : null;

  //Parametros para insertar el empleado
  let legajo = body.formulario.legajo != undefined ? body.formulario.legajo : null;
  let fecha_ingreso =
    body.formulario.fecha_ingreso != undefined
      ? body.formulario.fecha_ingreso
      : `now()::date`;
  let descripcion =
    body.formulario.descripcion != undefined ? body.formulario.descripcion : null;
  let empresas_id =
    body.formulario.empresas_id != undefined ? body.formulario.empresas_id : null;
  let oficina = body.formulario.oficina != undefined ? body.formulario.oficina : null;
  let empleados_id =
    body.empleado_id != undefined || body.empleado_id != ""
      ? body.empleado_id
      : null;




  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");


      const { rows } = await client.query(qCiudades.getCiudadesIdPorNombre, [body.formulario.ciudades]);
      let queryDomicilio;
      if (domicilios_id == undefined || domicilios_id == "null") {
        queryDomicilio = {
          name: "insert-domicilios",
          text: qDomicilios.insertDomiciliosReturnIdFull,
          values: [
            calle,
            numero,
            piso,
            depto,
            manzana,
            lote,
            block,
            barrio,
            rows[0].id,
          ],
        };
      } else {
        queryDomicilio = {
          name: "update-domicilios",
          text: qDomicilios.updateDomicilio,
          values: [
            calle,
            numero,
            piso,
            depto,
            manzana,
            lote,
            block,
            barrio,
            rows[0].id,
            domicilios_id,
          ],
        };
      }

      console.log({ '1': queryDomicilio.text, "values": queryDomicilio.values });
      const { domicilios } = await client.query(queryDomicilio.text, queryDomicilio.values);

      console.log({ 'domicilios': domicilios });
      if (queryDomicilio.name == "insert-domicilio") {
        domicilios_id = domicilios[0].id;
      }

      let queryPersona;
      if (personas_id == undefined || personas_id == "null") {
        queryPersona = {
          name: "insert-personas",
          text: qPersonas.insertReturingId,
          values: [
            nro_doc,
            tipo_doc,
            apellido,
            nombre,
            telefono,
            celular,
            email,
            fecha_nac,
            body.formulario.sexo,
            tipo_persona,
            fecha_carga,
            domicilios_id,
          ],
        };
      } else {
        queryPersona = {
          name: "update-personas",
          text: qPersonas.updatePersonas,
          values: [
            nro_doc,
            tipo_doc,
            apellido,
            nombre,
            telefono,
            celular,
            email,
            fecha_nac,
            body.formulario.sexo,
            domicilios_id,
            personas_id,
          ],
        };
      }
      console.log({ '1': queryPersona.text, "values": queryPersona.values });
      const { personas } = await client.query(queryPersona.text, queryPersona.values);

      console.log({ '1': 2 });
      console.log({ 'personas': personas });
      if (personas_id == undefined || personas_id == "null") {
        personas_id = personas[0].id;
      }

      let queryEmpleado;
      if (empleados_id == undefined || empleados_id == "null") {
        queryEmpleado = {
          name: "insert-empleados",
          text: qEmpleados.insertEmpleadoReturnId,
          values: [
            personas_id,
            legajo,
            fecha_ingreso,
            descripcion,
            empresas_id,
            oficina,
          ],
        };
      } else {
        queryEmpleado = {
          name: "update-empleados",
          text: qEmpleados.updateEmpleado,
          values: [
            personas_id,
            legajo,
            fecha_ingreso,
            descripcion,
            empresas_id,
            oficina,
            empleados_id,
          ],
        };
      }

      const { empleados } = await client.query(queryEmpleado.text, queryEmpleado.values);

      console.log({ '1': 3 });
      console.log({ 'empleados': personas });


      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El empleado se cargo exitosamente",
        id: empleados,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error..." });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};


//DELETE


exports.deleteEmpleado = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      const { eliminar_empleado } = await client.query(qEmpleados.deleteEmpleado,
        [
          req.params.empleado_id
        ]);

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El empleado fue eliminado exitosamente",
        id: req.params.empleado_id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al eliminar el empleado" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};