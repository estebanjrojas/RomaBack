const qPublic = require("./query/Sucursales.js");
const querySrv = require("../services/QueryService");

exports.sucursalesAbiertas = function (req, res) {
  querySrv
    .getQueryResults(qPublic.sucursalesAbiertas, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};
