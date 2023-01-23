const querySrv = require("../services/QueryService");
const qFacturas = require("./query/Facturas.js");

exports.getTiposComprobante = function (req, res) {
    querySrv.getQueryResults(qFacturas.getTipoFacturas, [])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}