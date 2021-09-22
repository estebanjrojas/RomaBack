const qProvincias = require('./query/Provincias.js');
const querySrv = require("../services/QueryService");

exports.getProvinciasPorPais = function (req, res) {
    querySrv.getQueryResults(qProvincias.getProvinciasPorPais, [req.params.paises_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));  
}
