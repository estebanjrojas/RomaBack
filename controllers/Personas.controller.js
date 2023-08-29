const qPersonas = require("./query/Personas");
const qDomicilios = require("./query/Domicilios");
const querySrv = require("../services/QueryService");

exports.insertPersonaReturnId = function (req, res) {
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
  let fecha_cese =
    req.body.fecha_cese != undefined ? `'` + req.body.fecha_cese + `'` : `null`;
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
  let domicilios_id =
    req.body.domicilios_id != undefined
      ? `'` + req.body.domicilios_id + `'`
      : `null`;

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
      fecha_cese,
      usuario_carga,
      fecha_carga,
      telefono_caracteristica,
      celular_caracteristica,
      domicilios_id,
    ])
    .then((response) =>
      res.send({
        mensaje: "La persona se cargo exitosamente",
        id: response.value[0].id,
      })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.insertPersonaDomicilio = function (req, res) {
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
  let fecha_cese =
    req.body.fecha_cese != undefined ? `'` + req.body.fecha_cese + `'` : `null`;
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
    .then((response) => {
      const domicilios_id = response.value[0].id;
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
          fecha_cese,
          usuario_carga,
          fecha_carga,
          telefono_caracteristica,
          celular_caracteristica,
          domicilios_id,
        ])
        .then((response) =>
          res.send({
            mensaje: "La persona se cargo exitosamente",
            id: response.value[0].id,
          })
        )
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
          mensaje: `Ha ocurrido Error al cargar el domicilio ${err}`,
        })
      )
    );
};

exports.getPersonaPorNroDoc = function (req, res) {
  querySrv
    .getQueryResults(qPersonas.getPersonaPorNroDoc, [
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
