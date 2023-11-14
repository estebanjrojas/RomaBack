const qPersonas = require("../controllers/query/Personas");
const qDomicilios = require("../controllers/query/Domicilios");
const qClientes = require("../controllers/query/Clientes");
const qCiudades = require("../controllers/query/Ciudades");
const querySrv = require("../services/QueryService");
var { Pool } = require("pg");
const configuracion = require("../utillities/config");
const connectionString = configuracion.bd;

//----------------------------------GET----------------------------------//

exports.getClientesTodos = async function (req, res) {
  querySrv
    .getQueryResults(qClientes.getClientesTodos, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getClientesBusqueda = async function (req, res) {
  querySrv
    .getQueryResults(qClientes.getClientesBusqueda, [req.params.texto_busqueda])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getClientesWhere = async function (req, res) {
  querySrv
    .getQueryResults(qClientes.getClientesWhere, [
      req.params.campo_busqueda,
      req.params.texto_buscar,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getDatosClientePorId = async function (req, res) {
  querySrv
    .getQueryResults(qClientes.getDatosClientePorId, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

//-----------> PAGINACION INICIO :
exports.getCantidadPaginasClientes = function (req, res) {
  querySrv
    .getQueryResults(qClientes.getCantidadPaginasClientes, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res.status(400).send({ mensaje: `Ha ocurrido Error ${err}` })
    );
};

exports.getCantidadPaginasClientesTxt = function (req, res) {
  let parametrosBusqueda = ``;
  let habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  let habilitarBusquedaApellido = parseInt(req.params.busca_apellido);
  let habilitarBusquedaDni = parseInt(req.params.busca_dni);
  let habilitarBusquedaFechaNac = parseInt(req.params.busca_fecha_nac);

  if (
    habilitarBusquedaNombre +
    habilitarBusquedaApellido +
    habilitarBusquedaDni +
    habilitarBusquedaFechaNac >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE `;
    if (habilitarBusquedaNombre == 1) {
      parametrosBusqueda =
        parametrosBusqueda + `p.nombre::varchar ilike '%${req.params.txt}%'`;
    }
    if (habilitarBusquedaApellido == 1) {
      if (habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.apellido::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.apellido::varchar ilike '%${req.params.txt}%'`;
      }
    }

    if (habilitarBusquedaDni == 1) {
      if (habilitarBusquedaApellido + habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda + `p.nro_doc::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.nro_doc::varchar ilike '%${req.params.txt}%'`;
      }
    }
    if (habilitarBusquedaFechaNac == 1) {
      if (
        habilitarBusquedaNombre +
        habilitarBusquedaApellido +
        habilitarBusquedaDni ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.fecha_nac::varchar ilike '%${req.params.txt}%'`;
      }
    }
  }

  const query = ` 
    SELECT 
        COUNT(*) as cantidad_registros,
        (COUNT(*)/20 )+ (CASE WHEN COUNT(*) % 20 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
    FROM (
        SELECT cli.id AS clientes_id, cli.fecha_alta, p.id AS personas_id, p.* 
        FROM roma.clientes cli
        JOIN personas p ON cli.personas_id = p.id
        ${parametrosBusqueda} AND cli.fecha_baja is null
    )x `;

  querySrv
    .getQueryResults(query, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res.status(400).send({ mensaje: `Ha ocurrido Error ${err}` })
    );
};

exports.getClientes = function (req, res) {
  querySrv
    .getQueryResults(qClientes.getClientes, [
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

exports.getClientesTxt = function (req, res) {
  let parametrosBusqueda = ``;
  const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  const habilitarBusquedaApellido = parseInt(req.params.busca_apellido);
  const habilitarBusquedaDni = parseInt(req.params.busca_dni);
  const habilitarBusquedaFechaNac = parseInt(req.params.busca_fecha_nac);

  if (
    habilitarBusquedaNombre +
    habilitarBusquedaApellido +
    habilitarBusquedaDni +
    habilitarBusquedaFechaNac >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE `;
    if (habilitarBusquedaNombre == 1) {
      parametrosBusqueda =
        parametrosBusqueda +
        `p.nombre::varchar ilike '%` +
        req.params.txt +
        `%'`;
    }
    if (habilitarBusquedaApellido == 1) {
      if (habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.apellido::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.apellido::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }

    if (habilitarBusquedaDni == 1) {
      if (habilitarBusquedaApellido + habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.nro_doc::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.nro_doc::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
    if (habilitarBusquedaFechaNac == 1) {
      if (
        habilitarBusquedaNombre +
        habilitarBusquedaApellido +
        habilitarBusquedaDni ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.fecha_nac::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.fecha_nac::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
  }
  const query = ` 
    SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
    FROM roma.clientes cli
    JOIN personas p ON cli.personas_id = p.id 
    ${parametrosBusqueda} AND cli.fecha_baja is null
    ORDER BY p.apellido, p.nombre
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

//----------------------------------POST----------------------------------//

exports.insertClientePersonaDomicilio = function (req, res) {
  //Parametros para insertar el domicilio
  let calle =
    req.body.domicilio.calle != undefined
      ? `'` + req.body.domicilio.calle + `'`
      : `null`;
  let numero =
    req.body.domicilio.numero != undefined
      ? `'` + req.body.domicilio.numero + `'`
      : `null`;
  let piso =
    req.body.domicilio.piso != undefined
      ? `'` + req.body.domicilio.piso + `'`
      : `null`;
  let depto =
    req.body.domicilio.depto != undefined
      ? `'` + req.body.domicilio.depto + `'`
      : `null`;
  let manzana =
    req.body.domicilio.manzana != undefined
      ? `'` + req.body.domicilio.manzana + `'`
      : `null`;
  let lote =
    req.body.domicilio.lote != undefined
      ? `'` + req.body.domicilio.lote + `'`
      : `null`;
  let block =
    req.body.domicilio.block != undefined
      ? `'` + req.body.domicilio.block + `'`
      : `null`;
  let barrio =
    req.body.domicilio.barrio != undefined
      ? `'` + req.body.domicilio.barrio + `'`
      : `null`;
  let ciudades_id =
    req.body.domicilio.ciudades_id != undefined
      ? `'` + req.body.domicilio.ciudades_id + `'`
      : `null`;
  //Parametros para insertar la persona
  let nro_doc = req.body.nro_doc != undefined ? req.body.nro_doc : `null`;
  let tipo_doc = req.body.tipo_doc != undefined ? req.body.tipo_doc : `null`;
  let apellido =
    req.body.apellido != undefined ? `'` + req.body.apellido + `'` : `null`;
  let nombre =
    req.body.nombre != undefined ? `'` + req.body.nombre + `'` : `null`;
  let telefono = req.body.telefono != undefined ? req.body.telefono : `null`;
  let celular =
    req.body.telefono_cel != undefined ? req.body.telefono_cel : `null`;
  let email = req.body.email != undefined ? `'` + req.body.email + `'` : `null`;
  let fecha_nac =
    req.body.fecha_nac != undefined ? `'` + req.body.fecha_nac + `'` : `null`;
  let genero = req.body.genero != null ? req.body.genero : `N`;
  let tipo_persona =
    req.body.tipo_persona != undefined ? req.body.tipo_persona : `null`;

  let usuario =
    req.body.usuario != undefined ? `'` + req.body.usuario + `'` : `null`;
  let usuario_carga =
    req.body.usuario_carga != undefined
      ? `'` + req.body.usuario_carga + `'`
      : `null`;

  let fecha_carga =
    req.body.fecha_carga != undefined
      ? `'` + req.body.fecha_carga + `'`
      : `null`;
  let telefono_caracteristica =
    req.body.telefono_caracteristica != undefined
      ? `'` + req.body.telefono_caracteristica + `'`
      : `null`;
  let celular_caracteristica =
    req.body.celular_caracteristica != undefined
      ? `'` + req.body.celular_caracteristica + `'`
      : `null`;
  //Parametros para insertar el cliente
  let fecha_alta =
    req.body.fecha_alta != undefined
      ? `'` + req.body.fecha_alta + `'`
      : `now()::date`;

  querySrv
    .getQueryResults(qDomicilios.insertDomiciliosReturnIdFull, [
      calle,
      numero,
      piso,
      depto,
      manzana,
      lote,
      block,
      barrio,
      ciudades_id,
    ])
    .then((domicilioResp) => {
      let domicilios_id = domicilioResp.value[0].id;
      querySrv
        .getQueryResults(qPersonas.insertReturingId, [
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
          usuario_carga,
          fecha_carga,
          telefono_caracteristica,
          celular_caracteristica,
          domicilios_id,
        ])
        .then((personaResp) => {
          let personas_id = personaResp.value[0].id;
          querySrv
            .getQueryResults(qClientes.insertClienteReturnId, [
              fecha_alta,
              personas_id,
            ])
            .then((clienteResp) =>
              res.send({
                mensaje: "El cliente se cargo exitosamente",
                insertado: clienteResp.value[0],
              })
            )
            .catch((err) =>
              res
                .status(400)
                .send(
                  JSON.stringify({
                    mensaje: `Ha ocurrido error al cargar el cliente ${err}`,
                  })
                )
            );
        })
        .catch((err) =>
          res
            .status(400)
            .send(
              JSON.stringify({
                mensaje: `Ha ocurrido error al cargar los datos personales ${err}`,
              })
            )
        );
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          JSON.stringify({
            mensaje: `Ha ocurrido error al cargar el domicilio ${err}`,
          })
        )
    );
};

exports.guardarClientePersonaDomicilio = function (req, res) {
  // "{
  // "documento":"14359398",
  // "apellido":" Escobar",
  // "nombre":"Aldo Ruben",
  // "fecha_nacimiento":"1961-08-15T03:00:00.000Z",
  // "calle":"(Pasaje) Cabildo De 1810 ",
  // "numero":"2234",
  // "piso":"",
  // "depto":"4",
  // "manzana":"g",
  // "provincia":"23",
  // "ciudades":"SAN MIGUEL DE TUCUMAN",
  // "ciudades_id":"463",
  // "nombre_usuario":"erojas",
  // "tipo_doc":"3",
  // "telefono":"",
  // "celular":"156312813",
  // "email":"aldore_19@gmail.com",
  // "clientes_id":"635",
  // "personas_id":"4314",
  // "domicilios_id":"1814"}"

  //Parametros para insertar el domicilio
  let clientes_id =
    req.body.clientes_id != undefined || req.body.clientes_id != ""
      ? req.body.clientes_id
      : null;
  let domicilios_id =
    req.body.domicilios_id != undefined || req.body.domicilios_id != ""
      ? req.body.domicilios_id
      : null;
  let personas_id =
    req.body.personas_id != undefined || req.body.personas_id != ""
      ? req.body.personas_id
      : null;
  let calle =
    req.body.calle != undefined || req.body.calle != "" ? req.body.calle : null;
  let numero =
    req.body.numero != undefined || req.body.numero != ""
      ? req.body.numero
      : null;
  let piso =
    req.body.piso != undefined || req.body.piso != "" ? req.body.piso : null;
  let depto =
    req.body.depto != undefined || req.body.depto != "" ? req.body.depto : null;
  let manzana =
    req.body.manzana != undefined || req.body.manzana != ""
      ? req.body.manzana
      : null;
  let ciudades_id =
    req.body.ciudades_id != undefined || req.body.ciudades_id != ""
      ? req.body.ciudades_id
      : null;

  //Parametros para insertar la persona
  let nro_doc =
    req.body.documento != undefined || req.body.documento != ""
      ? req.body.documento
      : null;
  let tipo_doc = `1`;
  let apellido =
    req.body.apellido != undefined || req.body.apellido != ""
      ? req.body.apellido
      : null;
  let nombre =
    req.body.nombre != undefined || req.body.nombre != ""
      ? req.body.nombre
      : null;
  let fecha_nac =
    req.body.fecha_nacimiento != undefined || req.body.fecha_nacimiento != ""
      ? req.body.fecha_nacimiento
      : null;
  let genero =
    req.body.genero != undefined || req.body.genero != ""
      ? req.body.genero
      : "N";
  let telefono =
    req.body.telefono != undefined || req.body.telefono != ""
      ? req.body.telefono
      : null;
  let celular =
    req.body.celular != undefined || req.body.celular != ""
      ? req.body.celular
      : null;
  let email =
    req.body.email != undefined || req.body.email != "" ? req.body.email : null;
  let tipo_persona = `2`;
  let usuario =
    req.body.nombre_usuario != undefined || req.body.nombre_usuario != ""
      ? req.body.nombre_usuario
      : null;

  let queryDomicilio;
  if (domicilios_id == undefined || domicilios_id == "null") {
    queryDomicilio = {
      name: "insert-domicilios",
      text: qDomicilios.insertDomiciliosReturnId,
      values: [calle, numero, piso, depto, manzana, ciudades_id],
    };
  } else {
    queryDomicilio = {
      name: "update-domicilios",
      text: qDomicilios.updateDomicilio,
      values: [calle, numero, piso, depto, manzana, ciudades_id, domicilios_id],
    };
  }

  console.log({ queryDomicilio: queryDomicilio });
  querySrv
    .getQueryResults(queryDomicilio.text, queryDomicilio.values)
    .then((domiclioResp) => {
      console.log({ respuestaDom: domiclioResp });
      if (queryDomicilio.name == "insert-domicilios") {
        domicilios_id = domiclioResp.value[0].id;
      }
      let queryPersona;
      if (personas_id == undefined || personas_id == "null") {
        queryPersona = {
          name: "insert-personas",
          text: qPersonas.insertPersonaReturningId,
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
            usuario,
            personas_id,
            domicilios_id,
          ],
        };
      }

      console.log({ queryPersona: queryPersona });
      querySrv
        .getQueryResults(queryPersona.text, queryPersona.values)
        .then((personaResp) => {
          console.log({
            personaResp: personaResp,
            value: personaResp.value[0].id,
          });
          if (personas_id == undefined || personas_id == "null") {
            personas_id = personaResp.value[0].id;
          }
          let queryCliente;
          if (clientes_id == undefined || clientes_id == "null") {
            queryCliente = {
              name: "insert-clientes",
              text: qClientes.insertClienteReturnId,
              values: [personas_id],
            };
          } else {
            queryCliente = {
              name: "update-clientes",
              text: qClientes.updateClientesDomicilios,
              values: [personas_id, clientes_id],
            };
          }
          querySrv
            .getQueryResults(queryCliente.text, queryCliente.values)
            .then((clienteResp) => {
              console.log({ clientResp: clienteResp });
              res.send({
                mensaje: `El cliente se ha cargado exitosamente`,
                id: clienteResp.value[0].id,
              });
            })
            .catch((err) =>
              res
                .status(400)
                .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
            );
        })
        .catch((err) =>
          res
            .status(400)
            .send(
              JSON.stringify({
                mensaje: `Ha ocurrido error al cargar los datos personales ${err}`,
              })
            )
        );
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          JSON.stringify({
            mensaje: `Ha ocurrido error al cargar el domicilio ${err}`,
          })
        )
    );
};



exports.insertCliente = function (req, res) {

  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  console.log({ 'body': body });

  //Parametros para insertar el domicilio
  let clientes_id =
    req.body.cliente_id != undefined || req.body.cliente_id != ""
      ? req.body.cliente_id
      : null;

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
  let fecha_nac = body.formulario.fecha_nacimiento != undefined ? body.formulario.fecha_nacimiento : null;
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

      let queryCliente;
      if (clientes_id == undefined || clientes_id == "null") {
        queryCliente = {
          name: "insert-clientes",
          text: qClientes.insertClienteReturnId,
          values: [personas_id],
        };
      } else {
        queryCliente = {
          name: "update-clientes",
          text: qClientes.updateClientesDomicilios,
          values: [personas_id, clientes_id],
        };
      }


      const { clientes } = await client.query(queryCliente.text, queryCliente.values);

      console.log({ '1': 3 });
      console.log({ 'clientes': clientes });


      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El Cliente se cargo exitosamente",
        id: clientes,
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


exports.deleteCliente = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      const { eliminar_cliente } = await client.query(qClientes.deleteCliente,
        [
          req.params.cliente_id
        ]);

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El cliente fue eliminado exitosamente",
        id: req.params.empleado_id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al eliminar el cliente" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};