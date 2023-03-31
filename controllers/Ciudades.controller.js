const qCiudades = require("./query/Ciudades.js");
const querySrv = require("../services/QueryService");

exports.getCiudadesPorProvincia = function (req, res) {
  querySrv
    .getQueryResults(qCiudades.getCiudadesPorProvincia, [
      req.params.provincias_id,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getCiudadesIdPorNombre = function (req, res) {
  querySrv
    .getQueryResults(qCiudades.getCiudadesIdPorNombre, [req.params.nombre])
    .then((response) => res.send({ id: response.value[0].id }))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.selectAllCiudades = function (req, res) {
  querySrv
    .getQueryResults(qCiudades.selectAll, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};
